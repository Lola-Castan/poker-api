import { Body, Controller, Dependencies, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
@Dependencies(UsersService)
export class UsersController {
    constructor(private usersService: UsersService){}
    @Get()
        async findAll(): Promise<User[]>{
            return this.usersService.findAll();
        }

    @Get(":id")
    async findOne(@Param("id") id : number): Promise<User | null>{
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() body: { name: string; email: string; password: string }): Promise<User> {
        console.log("Reçu dans le body :", body);
        return this.usersService.create(body);
    }

    @Post(":id/pay")
    async pay(@Param("id") id: number, @Body() body: { amount: number }): Promise<User | null> {
       let userToUpdate = await this.usersService.pay(id, body.amount);
        if(!userToUpdate){
            throw new Error('Utilisateur non trouvé');
          }
          if(userToUpdate.money < body.amount){
            throw new Error('Fonds insuffisants');
          }
          return userToUpdate;
    }
    
}