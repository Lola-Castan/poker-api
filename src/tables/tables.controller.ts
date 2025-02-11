import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { TablesService } from './tables.service'

@Controller('tables')
export class TablesController {
    constructor(private tablesService : TablesService) {}
    @Get()
    findAll() {
        return this.tablesService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id : number){
        return this.tablesService.findOne(id)
    }
}

