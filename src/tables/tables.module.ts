import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { DecksService } from 'src/decks/decks.service';
import { DecksModule } from 'src/decks/decks.module';

@Module({
    imports: [DecksModule],
    controllers: [TablesController],
    providers: [TablesService],
    exports: [TablesService]
})
export class TablesModule {}
