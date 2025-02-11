export class TablesService {
    tables : any[];
    constructor() {
        console.log('tables service construction')
        this.tables = ['Table 1', 'Table 2', 'Table 3', 'Table des As']
    }

    findAll() {
        return this.tables
    }

    findOne(id: number) {
        return this.tables[id]
    }
}
