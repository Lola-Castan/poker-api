import { Body, Controller, Get, Param, ParseIntPipe, Post, Request } from '@nestjs/common'
import { TablesService } from './tables.service'
import { UsersService } from 'src/users/users.service';
import { NotFoundException } from "@nestjs/common"

@Controller('tables')
export class TablesController {
    constructor(private tablesService : TablesService, private usersService: UsersService) {}
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
    // pas besoin de route
    // @Get(":id/small-blind")
    // smallBlind(@Param("id") id : number, @Request() req : any) {
    //     // user ? token ?
    //     this.tablesService.smallBlind(id, req)
    // }

    // pas besoin de route
    // @Get(":id/big-blind")
    // bigBlind(@Param("tableId") tableId : number) {
    //     // user ? token ?
    //     this.tablesService.bigBlind(tableId)
    // }

    @Post(":tableId/join")
    async join(@Param("tableId", ParseIntPipe) tableId : number, @Body() body: any) {
        const userId = body.userId
        let table = await this.findOne(tableId)
        let user = await this.usersService.findOne(userId)

        if(!table) {
            throw new NotFoundException("Table with id " + tableId + " not found")
        }

        if(!user) {
            throw new NotFoundException("User with id " + userId + " not found")
        }
        this.tablesService.join(tableId, body.userId)
    }

    @Post(":tableId/fold")
    async fold(@Param("tableId", ParseIntPipe) tableId : number, @Body() body: any) {
        const userId = body.userId
        let table = await this.findOne(tableId)
        let user = await this.usersService.findOne(userId)

        if(!table) {
            throw new NotFoundException("Table with id " + tableId + " not found")
        }

        if(!user) {
            throw new NotFoundException("User with id " + userId + " not found")
        }
        this.tablesService.fold(userId, tableId)
    }
}

