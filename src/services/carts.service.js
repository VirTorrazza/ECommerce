import Repository from "./repository.js";

export default class CartsService extends Repository {
    constructor(dao) {
        super(dao);
    }

    async getById(id) {
        try {
            return await this.dao.getById({_id:id});
        } catch (error) {
            console.error("Error getting cart by ID:", error);
            throw new Error(`Error getting cart by ID: ${error.message}`);
        }
    }

    async save(data) {
        try {
            return await this.dao.save(data);
        } catch (error) {
            console.error("Error saving cart:", error);
            throw new Error(`Error saving cart: ${error.message}`);
        }
    }

    async update(cid, data) {
        try {
            return await this.dao.update(cid, data);
        } catch (error) {
            console.error("Error updating cart:", error);
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            console.error("Error deleting cart:", error);
            throw new Error(`Error deleting cart: ${error.message}`);
        }
    }
    
}
