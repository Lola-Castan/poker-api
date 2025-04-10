import { Exclude } from "class-transformer";
import { Card } from "./card.entity";
import { User } from "./user.entity"

export class Table {
    id: number

    name: string
    
    @Exclude()
    deck: Card[]

    players: User[] = []

    pot: number = 0

    isBeingPlayed: boolean = false

    @Exclude()
    displayedCards: Card[] = []

    @Exclude()
    discardedCards: Card[] = []

    currentDealer?: number
}