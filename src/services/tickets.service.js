import PersistenceFactory from "../dao/persistenceFactory.js";


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

    async createTicket() {
        try {
            return await this.dao.createTicket();
        } catch (error) {
            console.error("Error in creating ticket in Ticket Service:", error);
            throw new Error(`Error in creating ticket in Ticket  Service: ${error.message}`);
        }
    }

}