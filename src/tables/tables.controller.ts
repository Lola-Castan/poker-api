import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common'
import { TablesService } from './tables.service'

@Controller('tables')
export class TablesController {
    constructor(private tablesService : TablesService) {}
    @Get()
    findAll() {
        return this.tablesService.findAll()
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id : number){
        return this.tablesService.findOne(id)
    }

    @Post()
    create(@Body() body: any) {
        console.log(body);
        this.tablesService.createTable(body);
    }

    //* Actions
    // @Get(":id/small-blind")
    // smallBlind(@Param("id") id : number, @Request() req : any) {
    //     // user ? token ?
    //     this.tablesService.smallBlind(id, req)
    // }

    @Get(":id/big-blind")
    // bigBlind(@Param("id") id : number) {
    //     // user ? token ?
    //     this.tablesService.bigBlind(id)
    // }

    @Post(":tableId/join")
    join(@Param("tableId", ParseIntPipe) tableId : number, @Body() body: any) {
        this.tablesService.join(tableId, body.userId)
    }
}

