import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
// import { DecksModule } from 'src/decks/decks.module';
import { UsersService } from 'src/users/users.service';
import  { UsersModule } from 'src/users/users.module';
import { DecksService } from 'src/decks/decks.service';

@Module({
    imports: [UsersModule],
    controllers: [TablesController],
    providers: [TablesService, DecksService],
    exports: [TablesService]
})
export class TablesModule {}