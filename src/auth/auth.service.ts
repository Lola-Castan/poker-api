import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import *as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(name: string, email: string, password: string){
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser){
      throw new BadRequestException ('Email existe déjà')
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({name, email, password: hashedPassword})
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(isPasswordValid, password, user.password)
    if (!isPasswordValid){
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    return `${user.name}, ${user.email}`;
        // const { userPassword, ...result } = user;
        // // TODO: Generate a JWT and return it here
        // // instead of the user object
        // return result;
  }

}
