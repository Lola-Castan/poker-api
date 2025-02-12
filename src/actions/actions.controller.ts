import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ActionsService } from './actions.service'

@Controller('actions')
export class ActionsController {
    constructor(private actionsService : ActionsService) {}
    @Get()
    findAll() {
        return this.actionsService.findAll()
    }

    @Post()
    call(@Body() body : any) {
        return this.actionsService.call(body);
    }
}
