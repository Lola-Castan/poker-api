import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Card } from "src/entities/card.entity";
// import { UserService } from "../users/users.service"

export class TablesService {
    tables : any[] = [];
    name: string;
    players: any[];
    constructor(public deckservice: DecksService) {
        for(let name of ['1', '2', '3', '4']) {
            // this.tables.push(this.createTable(name));
        }
        console.log("TablesService constructor")
    }

    createTable(name: string) {
        const table = new Table();
        table.name = name;
        table.deck = this.deckservice.createDeck()
    }

    // fonctionne
    findAll() {
        return this.tables
    }

    // fonctionne
    async findOne(name: string): Promise<Table | undefined> {
        return this.tables.find(table => table.name === name)
    }

    // join
    // join(token: string, name: string) {
        // table = this.findOne(name)
        // user = UserService.findOne(token)

        // if user solo in table
            // 2 AI join table
        // if not
            // jsp?
    // }
}
