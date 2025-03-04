import { Card } from "./card.entity";
import { User } from "./user.entity"

export class Table {
    id: number
    name: string
    deck: Card[]
    players: User[] = []
    pot: number = 0
    // todo ouark
    isBeingPlayed: boolean = false
    waitingPlayers: User[] = []
}