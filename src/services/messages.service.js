import PersistenceFactory from "../dao/factory/persistenceFactory.js";


export default class MessagesService {
    constructor() {
        this.init();
    }

    
    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('MESSAGE');
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            return await this.dao.getAll();
        } catch (error) {
            console.error("Error getting all messages:", error);
            throw new Error(`Error getting all messages: ${error.message}`);
        }
    }


    async create(user,message) {
        try {
            return await this.dao.create(user,message);
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error(`Error creating message: ${error.message}`);
        }
    }
}