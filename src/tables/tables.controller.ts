import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TablesService } from './tables.service'

@Controller('tables')
export class TablesController {
    constructor(private tablesService : TablesService) {}
    @Get()
    findAll() {
        return this.tablesService.findAll()
    }

    @Get(":name")
    findOne(@Param("name") name : string){
        return this.tablesService.findOne(name)
    }

    @Post()
    create(@Body() body: any) {
        console.log(body);
        this.tablesService.createTable(body);
    }

    //? Actions ?
    @Get(":tableName/small-blind")
    smallBlind(@Param("tableName") tableName : string) {
        // user ? token ?
        return this.tablesService.smallBlind(tableName)
    }

    @Get(":tableName/small-blind")
    bigBlind(@Param("tableName") tableName : string) {
        // user ? token ?
        return this.tablesService.bigBlind(tableName)
    }
}

