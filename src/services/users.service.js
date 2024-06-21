import PersistenceFactory from "../dao/factory/persistenceFactory.js";


export default class UsersService {
    constructor() {
        this.init();
    }

    init = async () => {
        try {
            this.dao = await PersistenceFactory.getPersistence('USER')
        } catch (error) {
            console.error('Failed to initialize repository:', error);
            throw error;
        }
    }

    async getAll(filters, paginateOptions) {
        try {
            return await this.dao.getAll(filters, paginateOptions);
        } catch (error) {
            console.error("Error getting all users:", error);
            throw new Error(`Error getting all users: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await this.dao.getById(id);
        } catch (error) {
            console.error("Error getting user by ID:", error);
            throw new Error(`Error getting user by ID: ${error.message}`);
        }
    }

    async save(data) {
        try {
            return await this.dao.save(data);
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error(`Error saving user: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    async updatePassword(user, password) {
        try {
            return await this.dao.updatePassword(user, password);
        } catch (error) {
            console.error("Error updating password:", error);
            throw new Error(`Error updating password: ${error.message}`);
        }
    }

    async updateRole(user, role) {
        try {
            return await this.dao.updateRole(user, role);
        } catch (error) {
            console.error("Error updating user role:", error);
            throw new Error(`Error updating user role: ${error.message}`);
        }
    }

    async updateLastConnection(email) {
        try {
            return await this.dao.updateLastConnection(email);
        } catch (error) {
            console.error("Error updating last connection:", error);
            throw new Error(`Error updating last connection: ${error.message}`);
        }
    }

    async getByEmail(email) {
        try {
            const user = await this.dao.getByEmail(email);
            return user;
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }
}
