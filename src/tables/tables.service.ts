import { Table } from "../entities/tables.entity"
// import { UserService } from "../users/users.service"

export class TablesService {
    tables : any[];
    constructor() {
        this.tables =  [];
        for(let name of ['1', '2', '3', 'TableDesAs']) {
            this.tables.push(new Table(name));
        }
    }

    findAll() {
        return this.tables
    }

    // findOne(name: string) {
    //     return this.tables
    // }

    async findOne(name: string): Promise<Table | undefined> {
        return this.tables.find(table => table.name === name)
    }

    // join
    join(token: string, name: string) {
        // table = this.findOne(name)
        // user = UserService.findOne(token)

        // if user solo in table
            // 2 AI join table
        // if not
            // jsp?
    }

    // ia tout le package entity
    // card pareil
}
