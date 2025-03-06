import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { Deck } from 'src/entities/deck.entity';
import { TablesService } from 'src/tables/tables.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DecksService {
    constructor(
        @Inject(forwardRef(() => TablesService))
        public tablesservice: TablesService, public usersservice: UsersService
    ) {}

    createDeck() : Card[]{
        let cards : Card[] = []
        let colors = ["♤", "♡", "♧", "♢"]
        let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

        for (let color of colors) {
            for (let power in values) {
                let value = values[power]
                let card = new Card(color, value, Number(power))
                cards.push(card)
            }
        }
        return cards
    }

    // async draw(tableId : number, count : number, userId?: number) {
    //     let table = await this.tablesservice.findOne(tableId)

    //     if(!userId && table) {
    //         for (let i = 0; i < count; i++) {
    //             let newCard = table.deck.pop()

    //             if (newCard) {
    //                 table.discardedCards.push(newCard)
    //             }
    //         }
    //         return table.discardedCards

    //     } else if(userId) {
    //         let user = await this.usersservice.findOne(userId)

    //         if(user && table) {
    //             for (let i = 0; i < count; i++) {
    //                 let newCard = table.deck.pop()

    //                 if (newCard) {
    //                     user.hand.push(newCard)
    //                 }
    //             }
    //             return user.hand
    //         }
    //     }
    // }

    async draw(deck : Card[]) {
        let newCard = deck.pop()
        return newCard
    }

    // Shuffle snippet found on StackOverflow
    shuffle(deck : Card[]) {
        const array = deck
        let currentIndex = array.length
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
        return deck
    }
}
