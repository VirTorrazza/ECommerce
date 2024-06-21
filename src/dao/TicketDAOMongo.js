import ticketModel from "./models/ticket.model.js";

export default class TicketDAOMongo {

    constructor(){
        this.model = ticketModel;
    }

    save = async (ticket) => {
        let result = await this.model.create(ticket);
        return result;
    }
}