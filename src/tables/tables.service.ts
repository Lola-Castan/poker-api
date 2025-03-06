import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Inject, Injectable, forwardRef } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { User } from "../entities/user.entity"
import { SMALL_BLIND } from 'src/constants'

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
        const smallBlind = SMALL_BLIND
        if(user)
            this.usersservice.pay(id, smallBlind)
    }

    // 2ème joueur à commencer à parler, il doit miser le double de la petite blinde
    async bigBlind(id: number, payload:any) {
        let table = this.findOne(id)
        let user = await this.usersservice.findByEmail(payload.email)
        const bigBlind = SMALL_BLIND * 2
        if(user)
            this.usersservice.pay(id, bigBlind)
    }

    //raise +100

    // Désigne le fait de simplement payer la mise de son adversaire pour continuer le déroulement du coup, sans surenchérir.
    call(id: number) {
        let table = this.findOne(id)
    }

    // Lorsqu'un joueur décide de “faire parole” et ne mise rien. L'action revient alors à son adversaire
    check(id: number) {
        let table = this.findOne(id)
    }

    // Lorsqu'un joueur décide de se coucher, il abandonne sa main et ne peut plus prétendre à remporter le pot.
    async fold(tableId: number) {
        let table = await this.findOne(tableId)
    }

    async join(tableId : number, userId : number) {
        let table = await this.findOne(tableId)
        let user = await this.usersservice.findOne(userId)

        if(!table) {
            throw new Error("Table not found")
        }

        if(!user) {
            throw new Error("User not found")
        }

        table.players.push(user)

        if(table.isBeingPlayed == true) {
            user.isWaiting = true
            return
        }
        return table
    }
}
