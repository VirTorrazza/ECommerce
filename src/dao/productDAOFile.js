import fs from 'fs';

export default class ProductDAOFile {
    constructor() {
        this.path = '/src/data/products.json';
        this.init();
    }

    async init() {
        try {
            if (!await fs.access(this.path)) {
                await fs.writeFile(this.path, JSON.stringify([]));
                console.log(`Created empty file: ${this.path}`);
            }
        } catch (error) {
            console.error('Error initializing product data file:', error);
            throw new Error('Cannot initialize product data');
        }
    }

    async readFile() {
        try {
            let data = await fs.readFile(this.path, 'utf-8'); //'utf-8' ensures string encoding
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
            console.error('Error getting all products:', error);
            throw new Error('Cannot get all products');
        }
    }

    async save(product) {
        try {
            let products = await this.getAll();
            if (products.length === 0) { 
                product.id = 1;
            } else {
                product.id = products[products.length - 1].id + 1;
            }
            products.push(product);
            await this.writeFile(products);
            return product;
        } catch (error) {
            console.error('Error saving product:', error);
            throw new Error('Cannot save product');
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

    async delete(productIdToDelete) {
        try {
            let products = await this.getAll();
            const indexToDelete = products.findIndex(product => product.id === productIdToDelete);

            if (indexToDelete === -1) {
                throw new Error('Product not found');
            }

            products.splice(indexToDelete, 1);
            await this.writeFile(products);
            console.log(`Product with ID ${productIdToDelete} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting product:', error);
            throw new Error('Cannot delete product');
        }
    }

    async update(id, newData) {
        try {
            let products = await this.getAll();
            const indexToUpdate = products.findIndex(product => product.id === id);

            if (indexToUpdate === -1) {
                throw new Error('Product not found');
            }

            products[indexToUpdate] = newData;
            await this.writeFile(products);

            console.log(`Product with ID ${id} updated successfully.`);
            return newData;
        } catch (error) {
            console.error('Error updating product:', error);
            throw new Error('Cannot update product');
        }
    }

    async getByCode(code) {
        try {
            let products = await this.getAll();
            const product = products.find(product => product.code === code);

            if (!product) {
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            console.error('Error finding product by code:', error);
            throw new Error(`Error finding product by code: ${error.message}`);
        }
    }
}
