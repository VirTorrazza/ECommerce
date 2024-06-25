import PersistenceFactory from "../dao/factory/persistenceFactory.js";


export default class TicketsService {
    constructor() {
        this.init();
    }

    
    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('TICKET');
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }

    async create(ticket) {
        try {
            console.log("soy ticket" + JSON.stringify(ticket))
            return await this.dao.create(ticket);
        } catch (error) {
            console.error("Error in creating ticket in Ticket Service:", error);
            throw new Error(`Error in creating ticket in Ticket  Service: ${error.message}`);
        }
    }

}