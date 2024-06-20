import fs from 'fs'; 

export default class cartDAOFile {
    constructor() {
        this.path = '/src/data/carts.json';
        this.init();
    }

    async init() {
        try {
            if (!await fs.access(this.path)) {
                await fs.writeFile(this.path, JSON.stringify([]));
                console.log(`Created empty file: ${this.path}`);
            }
        } catch (error) {
            console.error('Error initializing cart data file:', error);
            throw new Error('Cannot initialize cart data');
        }
    }

    async readFile() {
        try {
            let data = await fs.readFile(this.path, 'utf-8'); 
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            throw new Error('Cannot read file');
        }
    }

    async getAll() {
        try {
            return await this.readFile(); 
        } catch (error) {
            console.error('Error getting all carts:', error);
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
            return newCart;
        } catch (error) {
            console.error('Error creating cart:', error);
            throw new Error('Cannot create cart');
        }
    }

    async getById(id) {
        try {
            let carts = await this.getAll();
            const cart = carts.find(cart => cart.id === id);

            if (!cart) {
                throw new Error('Cart not found');
            }

            return cart;
        } catch (error) {
            console.error('Error getting cart by ID:', error);
            throw new Error(`Error getting cart by ID: ${error.message}`);
        }
    }

    async update(id, newData) {
        try {
            let carts = await this.getAll();
            const indexToUpdate = carts.findIndex(cart => cart.id === id);

            if (indexToUpdate === -1) {
                throw new Error('Cart not found');
            }

            carts[indexToUpdate] = { ...carts[indexToUpdate], ...newData };
            await this.writeFile(carts);

            console.log(`Cart with ID ${id} updated successfully.`);
            return carts[indexToUpdate];
        } catch (error) {
            console.error('Error updating cart:', error);
            throw new Error('Cannot update cart');
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing file:', error);
            throw new Error('Cannot write file');
        }
    }

    async delete(idToDelete) {
        try {
            let carts = await this.getAll();
            const indexToDelete = carts.findIndex(cart => cart.id === idToDelete);

            if (indexToDelete === -1) {
                throw new Error('Cart not found');
            }

            carts.splice(indexToDelete, 1);
            await this.writeFile(carts);
            console.log(`Cart with ID ${idToDelete} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting cart:', error);
            throw new Error('Cannot delete cart');
        }
    }
}
