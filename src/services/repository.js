import PersistenceFactory from "../dao/persistenceFactory.js";

export default class Repository {
    constructor() {
        this.dao = null; 
        this.init();
    }

    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence();
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }
}
