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

      async pay(user: User, amount: number): Promise<User | undefined>{
        let userToUpdate = await this.userRepository.findOneBy({id: user.id})
        if(userToUpdate){
          userToUpdate.money -= amount
          return await this.userRepository.save(userToUpdate)
        }
    }
}
