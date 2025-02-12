import { Deck } from "../entities/decks.entity";

export class Table{
    name: string
    deck: Deck
    constructor(name: string) { 
        this.name = name;
        this.deck = new Deck()
        // this.players ???
    }
}