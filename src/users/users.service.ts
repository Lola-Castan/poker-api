import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


// interface User{
//     id: number;
//     name: string;
//     email: string;
//     password: string;
// }
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
    async findOne(name: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { name } });
      }
    
      async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
      }

      async create(userData: Partial<User>): Promise<User> {
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
}
