import { Table } from "../entities/table.entity"
import { DecksService } from "../decks/decks.service"
import { Injectable } from "@nestjs/common";
import { SMALL_BLIND } from 'src/constants';

@Injectable()
export class TablesService {
    tables : any[] = [];
    name: string;
    players: any[];
    constructor(public deckservice: DecksService) {
        for(let name of ['1', '2', '3', '4']) {
            this.tables.push(this.createTable(name));
        }
        console.log("TablesService constructor")
    }

    createTable(name: string): Table {
        const table = new Table();
        table.name = name;
        table.deck = this.deckservice.createDeck();
        table.deck = this.deckservice.shuffle(table.deck);
        return table;
    }

    findAll() {
        return this.tables
    }

    async findOne(name: string): Promise<Table | undefined> {
        return this.tables.find(table => table.name === name)
    }

    // todo : ajouter gestion des utilisateurs (après merge avec Maria)
    // 1er joueur à commencer à parler, il doit miser la petite blinde
    smallBlind(tableName: string) {
        let table = this.findOne(tableName)
        // user : -10 balles // use SMALL_BLIND
    }

    // 2ème joueur à commencer à parler, il doit miser le double de la petite blinde
    bigBlind(tableName: string) {
        let table = this.findOne(tableName)
        // user : -20 balles // use SMALL_BLIND * 2
    }

    // Désigne le fait de simplement payer la mise de son adversaire pour continuer le déroulement du coup, sans surenchérir.
    call(tableName: string) {
        let table = this.findOne(tableName)
    }

    // Lorsqu'un joueur décide de “faire parole” et ne mise rien. L'action revient alors à son adversaire
    check(tableName: string) {
        let table = this.findOne(tableName)
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
