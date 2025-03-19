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
    async smallBlind(table: Table, user : User, payload: any) {
        console.log(payload)
        const smallBlind = SMALL_BLIND

        let player = table.players.find(player => player.id === user.id)
        if(player) {
            player.bid = smallBlind
            player.money -= smallBlind
        }
        this.updatePot(table)
    }

    // 2ème joueur à commencer à parler, il doit miser le double de la petite blinde
    async bigBlind(table: Table, user: User, payload:any) {
        const bigBlind = SMALL_BLIND * 2

        let player = table.players.find(player => player.id === user.id)
        if(player) {
            player.bid = bigBlind
            player.money -= bigBlind
        }
        this.updatePot(table)
    }
    
    // 3ème joueur qui rajoute une mise qu'il veut
    async raise(table: Table, user: User, payload: any) {

        let player = table.players.find(player => player.id === user.id);
        if (!player) {
            throw new NotFoundException("Joueur non trouvé dans cette table");
        }
        let playerRaise = payload.raise;
    
        if (player.money < payload.raise) {
            throw new Error("Pas suffisamment d'argent pour cette mise");
        }
    
        player.bid = playerRaise;
        player.money -= playerRaise;
        
        this.updatePot(table);
    }

    async updatePot(table: Table) {
        table.pot = table.players.reduce((total, player) => total + player.bid, 0);
    }
    

    // Désigne le fait de simplement payer la mise de son adversaire pour continuer le déroulement du coup, sans surenchérir.
    call(id: number) {
        let table = this.findOne(id)

    }

    // Lorsqu'un joueur décide de “faire parole” et ne mise rien. L'action revient alors à son adversaire
    check(id: number) {
        let table = this.findOne(id)
    }

    // Lorsqu'un joueur décide de se coucher, il abandonne sa main et ne peut plus prétendre à remporter le pot.
    async fold(userId: number, tableId: number) {
        let table = await this.findOne(tableId)
        let user = await this.usersservice.findOne(userId)

        if(user && table) {
            // ajouter les cartes de l'utilisateur dans les cartes défaussées
            table.discardedCards.push(...user.hand)
            user.hand = []
            user.isWaiting = true
            user.hasActed = true
            console.log(user.name + ' has folded !')
            //! utiliser l'userid c'est con ??? comment ils font les bots ? trouver autrement
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
                    // todo : wtf le dealer
                    table.currentDealer = Math.floor(Math.random() * (table.players.length));
                    this.startGame(table)

                } else if(table.players.length > 2) {
                    if(table.currentDealer) {
                        table.currentDealer = (table.currentDealer + 1) % table.players.length
                    }
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
            // renommer i en round (enfin joueur qui joueur)
            for (let i = 0; i < HAND_LENGHT; i++) {
                const card = await this.decksservice.draw(table.deck)
                if(card) {
                    player.hand.push(card)
                }
            }
        }

        // 1er tour
        if(table.pot == 0) {
            table.currentDealer = Math.floor(Math.random() * (table.players.length))
            console.log('The dealer is ' + table.players[table.currentDealer].name)
    
            this.burn(table)
            for (let i = 0; i < DISPLAYED_CARDS_LENGHT; i++) {
                let card = (await this.decksservice.draw(table.deck))
                if(card) {
                    table.displayedCards.push(card)
                }
            }
    
            let playerCount = table.players.length;
            for (let i = 0; i < playerCount; i++) {
                let currentPlayer = (table.currentDealer + i + 1) % playerCount;
                if (i === 0) {
                    // await this.smallBlind(table.players[currentPlayer].id);
                } else if (i === 1) {
                    // await this.bigBlind(table.players[currentPlayer].id);
                } else {
                    // Wait for the player's action
                    await this.waitForPlayerAction(table.players[currentPlayer]);
                }
            }
            // autre façon
            // let nextPlayer = (table.currentDealer + 1) % table.players.length
            // table.players[nextPlayer].id -> smallBlind
            // table.players[nextPlayer + 1].id -> bigBlind
        }
    }

    async waitForPlayerAction(player: User) {
        console.log('Waiting for ' + player.name + ' to act')
        // todo ajouter player.hasActed = true dans les actions
        // todo nettoyer player.hasActed = false à chaque tour
        while (!player.hasActed) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log(player.name + ' has acted')
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
