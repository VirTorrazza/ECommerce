import ticketModel from "./models/ticket.model.js";

export default class TicketDAOMongo {

    constructor(){
        this.model = ticketModel;
    }

    create= async (ticket) => {
        let result = await this.model.create(ticket);
        return result;
    }
}