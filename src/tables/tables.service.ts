import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common"
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
    async fold(tableId: number) {
        let table = await this.findOne(tableId)
    }

    async join(tableId : number, userId : number) {
        let table = await this.findOne(tableId)
        let user = await this.usersservice.findOne(userId)

        if(!table) {
            // todo error + deplacer dans controleur
            throw new NotFoundException("Table not found")
        }

        if(!user) {
            throw new Error("User not found")
        }

        if(table.isBeingPlayed) {
            table.waitingPlayers.push(user)
            return // todo
        } else {
            this.joinTable(table, user)

            if(table.players.length == 1) {
                const bot1 = await this.usersservice.createBot('bot1')
                const bot2 = await this.usersservice.createBot('bot2')

                this.joinTable(table, bot1, bot2)
                this.startGame(table)
            }

            // todo : gérer quand ya plusieurs vrai players
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
        console.log('The game on table ' + table.name + ' has started !!!!')

        for (let player of table.players) {
            player.hand = await this.decksservice.draw(table.id, player.id, 2)
            // position + gérer le dealer (à cahque partie la position change d'un rang)
            player.position = table.players.indexOf(player)
        }
    }
}