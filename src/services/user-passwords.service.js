import PersistenceFactory from "../dao/factory/persistenceFactory.js";

export default class UserPasswordsService {
    constructor() {
        this.init();
    }

    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('USERPASSWORD')
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }

    save = async (userToken) => {
        return await this.dao.save(userToken);
    }

    async delete(email) {
        try {
            const result = await this.dao.delete(email)
            console.log(`Deleted user with email ${email}. Result:`, result);
            return result;
        } catch (error) {
            console.error(`Error deleting user with email ${email}:`, error);
            throw error; 
        }
    }
}