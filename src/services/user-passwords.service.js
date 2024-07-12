import PersistenceFactory from "../dao/factory/persistenceFactory.js";

export default class UserPasswordsService {
    constructor() {
        this.init();
    }

    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('PASSWORD');
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }

    save = async (userToken) => {
        try {
            const result = await this.dao.save(userToken);
            console.log("Saved user token. Result:", result);
            return result;
        } catch (error) {
            console.error('Error saving user token:', error);
            throw error;
        }
    }

    delete = async (email) => {
        try {
            console.log("Deleting user with email:", email);
            const result = await this.dao.delete(email);
            console.log(`Deleted user with email ${email}. Result:`, result);
            return result;
        } catch (error) {
            console.error(`Error deleting user with email ${email}:`, error);
            throw error;
        }
    }
}