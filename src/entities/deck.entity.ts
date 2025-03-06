import { Exclude } from "class-transformer"
import { Card } from "./card.entity"

export class Deck {
    @Exclude()
    deck: Card[] = []
}