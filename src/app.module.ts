import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActionsController } from './actions/actions.controller';
import { ActionsService } from './actions/actions.service';
import { BotsModule } from './bots/bots.module';
import { DecksService } from './decks/decks.service';
import { TablesModule } from './tables/tables.module';
import { DecksModule } from './decks/decks.module';

@Module({
  imports: [BotsModule, TablesModule],
  controllers: [AppController, ActionsController],
  providers: [AppService, ActionsService],
})
export class AppModule {}
