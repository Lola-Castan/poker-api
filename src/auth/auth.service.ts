import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import *as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(name: string, email: string, password: string){
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser){
      throw new BadRequestException ('Email existe déjà')
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({name, email, password: hashedPassword})
  }

  async login(email: string, password: string): Promise<{access_token: string, userInfo: string}> {
    const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(isPasswordValid, password, user.password)
    if (!isPasswordValid){
      throw new UnauthorizedException('Mot de passe incorrect');
    }
    const payload = {sub: user.id, email: user.email}
    return  {
      access_token: await this.jwtService.signAsync(payload),
      userInfo: `${user.name}, ${user.email}`
    };
  }
}
