export class Deck{
    deck: string[]
    constructor() { 
        this.deck = []
        this.createDeck()
        this.shuffle()
    }
    createDeck() {
        let cards = []
        let colors = ["♤", "♡", "♧", "♢"]
        let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "1"]
        // todo comment on gère la "puissance" d'une carte ?
        // todo tableau associatif avec la puissance ?

        for (let color of colors) {
            for (let value of values) {
                let card = value + color
                cards.push(card)
            }
        }
        this.deck = cards;
    }
    // Shuffle snippet found on StackOverflow
    shuffle() {
        const array = this.deck;
        let currentIndex = array.length;
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
            // Pick a remaining element...
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
    }
}