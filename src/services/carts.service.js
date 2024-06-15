import Repository from "./repository.js";

export default class CartsService extends Repository {
    constructor(dao) {
        super(dao);
    }


    async createCart() {
        try {
            return await this.dao.createCart();
        } catch (error) {
            console.error("Error in creating cart Cart Service:", error);
            throw new Error(`Error in creating cart in Cart Service: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await this.dao.getById({_id:id});
        } catch (error) {
            console.error("Error getting cart by ID in Cart Service:", error);
            throw new Error(`Error getting cart by ID in Cart Service: ${error.message}`);
        }
    }

    async save(data) {
        try {
            return await this.dao.save(data);
        } catch (error) {
            console.error("Error saving cart in Cart Service:", error);
            throw new Error(`Error saving cart in Cart Service: ${error.message}`);
        }
    }

    async update(cid, data) {
        try {
            return await this.dao.update(cid, data);
        } catch (error) {
            console.error("Error updating cart in Cart Service:", error);
            throw new Error(`Error updating cart in Cart Service: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            console.error("Error deleting cart in Cart Service:", error);
            throw new Error(`Error deleting cart in Cart Service: ${error.message}`);
        }
    }
    
}
