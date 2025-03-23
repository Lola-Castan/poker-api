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
        const userName = body.userId
        let table = await this.findOne(tableId)
        let user = await this.usersService.findOneByName(userName)

        if(!table) {
            throw new NotFoundException("Table with id " + tableId + " not found")
        }

        if(!user) {
            throw new NotFoundException("User " + userName + " not found")
        }
        this.tablesService.fold(user, tableId)
    }

    @Post(":tableId/raise")
    async raise(@Param("tableId", ParseIntPipe) tableId : number, @Body() body: any) {
        const userName = body.userName
        const payload = body.payload
        let table = await this.findOne(tableId)
        let user = await this.usersService.findOneByName(userName)

        if(!table) {
            throw new NotFoundException("Table with id " + tableId + " not found")
        }
        if(!user) {
            throw new NotFoundException("User " + userName + " not found")
        }
        if (user.money < payload) {
            throw new Error("Too poor to raise");
        }
        const highestBet = this.tablesService.getHighestBet(table);
        if (payload <= highestBet) {
            throw new Error("Raise amount must be greater than the current highest bet");
        }
        this.tablesService.raise(table, user, payload)
    }

    @Post(":tableId/call")
    async call(@Param("tableId", ParseIntPipe) tableId : number, @Body() body: any) {
        const userName = body.userName
        let table = await this.findOne(tableId)
        let user = await this.usersService.findOneByName(userName)

        if(!table) {
            throw new NotFoundException("Table with id " + tableId + " not found")
        }
        if(!user) {
            throw new NotFoundException("User " + userName + " not found")
        }

        let payload = this.tablesService.getHighestBet(table)
    
        if (user.money < payload) {
            throw new Error("Too poor to call")
        }

        this.tablesService.call(table, user, payload)
    }
}

