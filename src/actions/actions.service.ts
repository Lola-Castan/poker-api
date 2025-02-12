export class ActionsService {
    actions : any[];
    constructor() {
        this.actions = [ 'check', 'fold', 'call', 'raise']
    }

    findAll() {
        return this.actions
    }

    call(action : any) {
        
    }
}
