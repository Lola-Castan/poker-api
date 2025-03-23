import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArgumentOutOfRangeError } from 'rxjs';

@Injectable()
export class UsersService {

  constructor (
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]>{
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  async findOneByName(name: string): Promise<User | null> {
    return this.userRepository.findOneBy({ name: name });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async pay(id: number, amount: number): Promise<User | null>{
      let userToUpdate = await this.userRepository.findOneBy({ id });
      if(!userToUpdate){
        return null;
      }
      userToUpdate.money -= amount
      return await this.userRepository.save(userToUpdate)
    }

  async createBot(name: string) {
    const bot = new User();
    bot.name = name;
    bot.email = `${name}@bot.com`;
    bot.password = '';
    bot.isBot = true;
    return bot;
  }
    
}
