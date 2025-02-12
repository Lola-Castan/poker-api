import { Controller, Get, Param } from '@nestjs/common'
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
}

