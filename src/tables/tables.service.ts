import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { User } from "../entities/user.entity"
import { SMALL_BLIND } from 'src/constants'
import { HAND_LENGHT } from 'src/constants'
import { DISPLAYED_CARDS_LENGHT } from 'src/constants'
// import { FLOP_LENGHT } from 'src/constants'

@Injectable()
export class TablesService {
    tables: Table[] = []
    name: string
    players: User[] = []
    constructor(
        @Inject(forwardRef(() => DecksService))
        public decksservice: DecksService, public usersservice: UsersService
    ) {
        let id = 1
        for (let name of ['1', '2', '3', '4']) {
            const table = this.createTable(name)
            table.id = id++
            this.tables.push(table)
        }
        console.log("TablesService constructor")
    }

    createTable(name: string): Table {
        const table = new Table()
        table.name = name
        table.deck = this.decksservice.createDeck()
        table.deck = this.decksservice.shuffle(table.deck)
        return table
    }

    findAll() {
        return this.tables
    }

    async findOne(id: number): Promise<Table | undefined> {
        return this.tables.find(table => table.id === id)
    }

    // 1er joueur à commencer à parler, il doit miser la petite blinde
    async smallBlind(table: Table, user : User) {
        const smallBlind = SMALL_BLIND

        if(user) {
            user.bid = smallBlind
            user.money -= smallBlind
        }
        this.updatePot(table)
    }

    // 2ème joueur à commencer à parler, il doit miser le double de la petite blinde
    async bigBlind(table: Table, user: User) {
        const bigBlind = SMALL_BLIND * 2

        if(user) {
            user.bid = bigBlind
            user.money -= bigBlind
        }
        this.updatePot(table)
    }
    
    // 3ème joueur qui rajoute une mise qu'il veut
    async raise(table: Table, user: User, payload: any) {
        user.bid = payload
        user.money -= payload
        
        this.updatePot(table);
        console.log(user.name + ' has raised by ' + payload + ' !')
        user.hasActed = true
    }

    async updatePot(table: Table) {
        table.pot = table.players.reduce((total, player) => total + player.bid, 0)
    }
    

    // Désigne le fait de simplement payer la mise de son adversaire pour continuer le déroulement du coup, sans surenchérir.
    call(table: Table, user: User, payload: number) {   
        user.bid = payload
        user.money -= payload
        
        this.updatePot(table)
        console.log(user.name + ' has called !')
        user.hasActed = true
    }

    // todo : Lorsqu'un joueur décide de “faire parole” et ne mise rien. L'action revient alors à son adversaire
    // check(id: number) {
    //     let table = this.findOne(id)
    // }

    // Lorsqu'un joueur décide de se coucher, il abandonne sa main et ne peut plus prétendre à remporter le pot.
    async fold(user: User, tableId: number) {
        let table = await this.findOne(tableId)

        if(user && table) {
            // ajouter les cartes de l'utilisateur dans les cartes défaussées
            table.discardedCards.push(...user.hand)
            user.hand = []
            user.isWaiting = true
            user.hasActed = true
            console.log(user.name + ' has folded !')
        }
    }

    async join(tableId : number, userId : number) {
        let table = await this.findOne(tableId)
        let user = await this.usersservice.findOne(userId)
        
        if(table && user) {
            if(!table.isBeingPlayed) {
                this.joinTable(table, user)
                user.isWaiting = false

                if(table.players.length == 1) {
                    const bot1 = await this.usersservice.createBot('Mario')
                    const bot2 = await this.usersservice.createBot('Luigi')
                    this.joinTable(table, bot1, bot2)
                    this.startGame(table)
                }
            }
        }
    }

    private joinTable(table: Table, ...users : User[]){
        users.forEach(user => { 
            table.players.push(user);
            console.log(user.name + " joined table " + table.name)
        }); 
    }

    private async startGame(table: Table) {
        table.isBeingPlayed = true
        console.log('The game on table ' + table.name + ' has started !!!')

        for (let player of table.players) {
            for (let cardCount = 0; cardCount < HAND_LENGHT; cardCount++) {
                const card = await this.decksservice.draw(table.deck)
                if(card) {
                    player.hand.push(card)
                }
            }
        }

        // 1er tour
        if(table.pot == 0) {
            // todo : fix qui permet de tester les actions avec le "vrai joueur" (les actions ne fonctionnent pas avec les bots)
            // table.currentDealer = Math.floor(Math.random() * (table.players.length))
            table.currentDealer = 0
            console.log('The dealer is ' + table.players[table.currentDealer].name)
    
            this.burn(table)
            for (let i = 0; i < DISPLAYED_CARDS_LENGHT; i++) {
                let card = (await this.decksservice.draw(table.deck))
                if(card) {
                    table.displayedCards.push(card)
                }
            }

            let playerCount = table.players.length;

            let smallBlindPlayerIndex = (table.currentDealer + 1) % playerCount;
            let bigBlindPlayerIndex = (table.currentDealer + 2) % playerCount;

            await this.smallBlind(table, table.players[smallBlindPlayerIndex]);
            console.log(table.players[smallBlindPlayerIndex].name + ' is the small blind');

            await this.bigBlind(table, table.players[bigBlindPlayerIndex]);
            console.log(table.players[bigBlindPlayerIndex].name + ' is the big blind');

            let currentPlayerIndex = (bigBlindPlayerIndex + 1) % playerCount;

            let allBidsEqual = false;
            while (!allBidsEqual) {
                allBidsEqual = table.players.every(player => player.bid === table.players[0].bid);
                if (!allBidsEqual) {
                    let player = table.players[currentPlayerIndex];
                    await this.waitForPlayerAction(player);
                    currentPlayerIndex = (currentPlayerIndex + 1) % playerCount;
                }
            }
            console.log('All players have the same bid, the round is over')
        }
    }

    async waitForPlayerAction(player: User) {
        console.log('Waiting for ' + player.name + ' to act')
        // todo ajouter player.hasActed = true dans les actions
        while (!player.hasActed) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log(player.name + ' has acted')
        player.hasActed = false;
    }

    getHighestBet(table: Table) {
        return table.players.reduce((max, player) => Math.max(max, player.bid), 0)
    }

    async burn(table: Table) {
        let cardToDiscard = await this.decksservice.draw(table.deck)
        if(cardToDiscard) {
            table.discardedCards.push(cardToDiscard)
        }
    }

    // TODO : tours suivants
    // async flop(table: Table) {
    //     this.burn(table)
    //     for (let i = 0; i < FLOP_LENGHT; i++) {
    //         let card = await this.decksservice.draw(table.deck)
    //         if(card) {
    //             table.deck.push(card)
    //         }
    //     }
    // }

    // async turn(table: Table) {
    //     this.burn(table)
    //     let card = await this.decksservice.draw(table.deck)
    //     if(card) {
    //         table.deck.push(card)
    //     }
    // }
}
