import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor (
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]>{
        return this.userRepository.find();
    }
    // private users: User[]
    // constructor(){
    //     this.users = [
    //         {id: 1, name: "Jean", email: "jean@mail.com", password: "1234"},
    //         {id: 2, name: "Alice", email: "alice@mail.com", password: "1234"},
    //     ];
    // }

    // create(user: any){
    //     this.users.push(user);
    //     return user;
    // }

    // findAll(): User[]{
    //     return this.users;
    // }
    // async findOne(name: string): Promise<{ name: string; password: string } | undefined> {
    //     return this.users.find(user => user.name === name);
    // }
    // async findByEmail(email: string): Promise<User | undefined> {
    //     return this.users.find(user => user.email === email);
    //   }
    // async findOne(name: string): Promise<User | null> {
    //     return await this.userRepository.findOne({ where: { name } });
    //   }

    //! fonctionne comme ça
    async findOne(id: number): Promise<User | null> {
      return this.userRepository.findOneBy({ id: id });
    }
    
    async findByEmail(email: string): Promise<User | null> {
      return await this.userRepository.findOne({ where: { email } });
    }

    async create(userData: Partial<User>): Promise<User> {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    }

      async pay(user: User, amount: number): Promise<User | undefined>{
        let userToUpdate = await this.userRepository.findOneBy({id: user.id})
        if(userToUpdate){
          userToUpdate.money -= amount
          return await this.userRepository.save(userToUpdate)
        }
    }
}
