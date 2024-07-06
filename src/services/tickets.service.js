import PersistenceFactory from "../dao/factory/persistenceFactory.js";
import logger from "../logger/logger.js";


export default class TicketsService {
    constructor() {
        this.init();
    }

    
    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('TICKET');
        } catch (error) {
            logger.error('Failed to initialize dao in TicketsService');
            throw error;
        }
    }

    async create(ticket) {
        try {
            logger.debug("Awaiting for ticket creation");
            return await this.dao.create(ticket);
        } catch (error) {
            logger.error(`Error in creating ticket in Ticket  Service: ${error.message}`);
            throw new Error(`Error in creating ticket in Ticket  Service: ${error.message}`);
        }
    }

}