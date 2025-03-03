export class ActionsService {
    actions : any[];
    constructor() {
        this.actions = [ 'check', 'fold', 'call', 'raise', 'smallBlind', 'bigBlind', 'allIn' ]
    }

    findAll() {
        return this.actions
    }

    call(action : string) {
        
    }
}
