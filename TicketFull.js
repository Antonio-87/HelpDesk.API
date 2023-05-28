const Ticket = require('./Ticket');

class TicketFull extends Ticket {
    constructor(id, name, description, status, created) {
        super(id, name, status, created);
        this.description = description;
    }
} 

module.exports = TicketFull;