import fs from 'fs'; 
import logger from '../logger/logger.js';

export default class CartDAOFile {
    constructor() {
        this.path = '/src/data/carts.json';
        this.init();
    }

    async init() {
        try {
            if (!await fs.access(this.path)) {
                await fs.writeFile(this.path, JSON.stringify([]));
                logger.debug(`Created empty file in cartDAOFile: ${this.path}`);
            }
        } catch (error) {
            logger.error(`Error: ${error}  when initializing cart data file`);
            throw new Error('Cannot initialize cart data');
        }
    }

    async readFile() {
        try {
            let data = await fs.readFile(this.path, 'utf-8'); 
            logger.debug(`Successfull reading file operation`);
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Reading File Error: ${error}`);
            throw new Error('Cannot read file');
        }
    }

    async getAll() {
        try {
            logger.debug(`awaiting getAll carts operation`);
            return await this.readFile(); 
        } catch (error) {
            logger.error(`Error at getting carts: ${error}`);
            throw new Error('Cannot get all carts');
        }
    }

    async createCart() {
        try {
            let carts = await this.getAll();
            let newCart = {
                id: carts.length + 1,
                products: []
            };
            carts.push(newCart);
            await this.writeFile(carts);
            logger.debug(`Successfull createCart operation`);
            return newCart;
        } catch (error) {
            logger.error(`Error when creating cart: ${error}`);
            throw new Error('Cannot create cart');
        }
    }

    async getById(id) {
        try {
            let carts = await this.getAll();
            const cart = carts.find(cart => cart.id === id);

            if (!cart) {
                logger.error(`Cart not found`);
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            logger.error(`Error getting cart by ID:${id}`);
            throw new Error(`Error getting cart by ID: ${error.message}`);
        }
    }

    async update(id, newData) {
        try {
            let carts = await this.getAll();
            const indexToUpdate = carts.findIndex(cart => cart.id === id);

            if (indexToUpdate === -1) {
                logger.error(`Cart not found`);
                throw new Error('Cart not found');
            }

            carts[indexToUpdate] = { ...carts[indexToUpdate], ...newData };
            await this.writeFile(carts);

            logger.debug(`Cart with ID ${id} updated successfully.`);
            return carts[indexToUpdate];
        } catch (error) {
            logger.error(`Error updating cart:${error}`);
            throw new Error('Cannot update cart');
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
            logger.debug(`Writing file...`);
        } catch (error) {
            logger.error(`Error writing file:${error}`);
            throw new Error('Cannot write file');
        }
    }

    async delete(idToDelete) {
        try {
            let carts = await this.getAll();
            const indexToDelete = carts.findIndex(cart => cart.id === idToDelete);

            if (indexToDelete === -1) {
                logger.error(`Cart not found`);
                throw new Error('Cart not found');
            }

            carts.splice(indexToDelete, 1);
            await this.writeFile(carts);
            logger.debug(`Cart with ID ${idToDelete} deleted successfully.`);
        } catch (error) {
            logger.error(`Error deleting cart:${error}`);
            throw new Error('Cannot delete cart');
        }
    }
}
