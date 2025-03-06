import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Inject, Injectable, forwardRef } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { User } from "../entities/user.entity"
import { SMALL_BLIND } from 'src/constants'
import { HAND_LENGHT } from 'src/constants'
import { FLOP_LENGHT } from 'src/constants'

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
    async smallBlind(id: number, payload:any) {
        console.log(payload)
        let table = this.findOne(id)
        let user = await this.usersservice.findByEmail(payload.email)
        if(user)
            this.usersservice.pay(user, 10)
        // user : -10 balles // use SMALL_BLIND
    }

    // 2ème joueur à commencer à parler, il doit miser le double de la petite blinde
    bigBlind(id: number) {
        let table = this.findOne(id)
        // user : -20 balles // use SMALL_BLIND * 2
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
    async fold(userId: number) {
        let user = await this.usersservice.findOne(userId)

        if(user) {
            user.hand = []
            user.isWaiting = true
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
            for (let i = 0; i < HAND_LENGHT; i++) {
                const card = await this.decksservice.draw(table.deck)
                if(card) {
                    player.hand.push(card)
                }
            }
        }

        // todo gérer dealer
        // todo gérer cartes de la table
    }

    async burn(table: Table) {
        let cardToDiscard = await this.decksservice.draw(table.deck)
        if(cardToDiscard) {
            table.discardedCards.push(cardToDiscard)
        }
    }

    async flop(table: Table) {
        this.burn(table)
        for (let i = 0; i < FLOP_LENGHT; i++) {
            let card = await this.decksservice.draw(table.deck)
            if(card) {
                table.deck.push(card)
            }
        }
    }

    async turn(table: Table) {
        this.burn(table)
        let card = await this.decksservice.draw(table.deck)
        if(card) {
            table.deck.push(card)
        }
    }
}
