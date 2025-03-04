import { IsNotEmpty, IsString, IsArray, IsNumber } from 'class-validator';
import { Card } from '../../entities/card.entity';
// todo
// import { ApiProperty } from '@nestjs/swagger'

export class CreateTableDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsArray()
    deck: Card[];

    @IsArray()
    players: object[];

    @IsNumber()
    pot: number;
}