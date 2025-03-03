import { Injectable } from '@nestjs/common';
import { Card } from 'src/entities/card.entity';
import { Deck } from 'src/entities/deck.entity';

@Injectable()
export class DecksService {
    constructor() {
        console.log("DecksService constructor")  
    }

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

    // Shuffle snippet found on StackOverflow
    shuffle(deck : Card[]) {
        const array = deck
        let currentIndex = array.length
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex)
            currentIndex--

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
    }
}
