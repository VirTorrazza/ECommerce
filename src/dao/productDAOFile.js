import fs from 'fs';
import logger from '../logger/logger.js';

export default class ProductDAOFile {
    constructor() {
        this.path = '/src/data/products.json';
        this.init();
    }

    async init() {
        try {
            if (!await fs.access(this.path)) {
                await fs.writeFile(this.path, JSON.stringify([]));
                logger.debug(`Created empty file in ProductDAOFile: ${this.path}`);
            }
        } catch (error) {
            logger.error(`Error: ${error}  when initializing product data file`);
            throw new Error('Cannot initialize product data');
        }
    }

    async readFile() {
        try {
            let data = await fs.readFile(this.path, 'utf-8'); //'utf-8' ensures string encoding
            logger.debug(`Successfull reading file operation in productDAOFile`);
            return JSON.parse(data);
        } catch (error) {
            logger.error(`Reading File Error: ${error}`);
            throw new Error('Cannot read file');
        }
    }

    async getAll() {
        try {
            logger.debug(`awaiting getAll products operation`);
            return await this.readFile(); 
        } catch (error) {
            logger.error(`Error at getting products in DAOFile: ${error}`);
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
            logger.debug(`Successfull save product operation`);
            return product;
        } catch (error) {
            logger.error(`Error when saving product in DAOFile: ${error}`);
            throw new Error('Cannot save product');
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2));
        } catch (error) {
            logger.error(`Error ${error} at writing file operation in productDAOFile`);
            throw new Error('Cannot write file');
        }
    }

    async delete(productIdToDelete) {
        try {
            let products = await this.getAll();
            const indexToDelete = products.findIndex(product => product.id === productIdToDelete);

            if (indexToDelete === -1) {
                logger.error(`Product with ID ${productIdToDelete} not found in delete operation`);
                throw new Error('Product not found');
            }

            products.splice(indexToDelete, 1);
            await this.writeFile(products);
            logger.debug(`Product with ID ${productIdToDelete} deleted successfully.`);
        } catch (error) {
            logger.error(`Error ${error} at delete product operation`);
            throw new Error('Cannot delete product');
        }
    }

    async update(id, newData) {
        try {
            let products = await this.getAll();
            const indexToUpdate = products.findIndex(product => product.id === id);

            if (indexToUpdate === -1) {
                logger.error(`Product with ID ${id} not found in update operation`);
                throw new Error('Product not found');
            }

            products[indexToUpdate] = newData;
            await this.writeFile(products);
            logger.debug(`Product with ID ${id} updated successfully.`);
            return newData;
        } catch (error) {
            logger.error(`Error ${error} at update product operation`);
            throw new Error('Cannot update product');
        }
    }

    async getByCode(code) {
        try {
            let products = await this.getAll();
            const product = products.find(product => product.code === code);

            if (!product) {
                logger.error(`Product with code ${code} not found`);
                throw new Error('Product not found');
            }

            return product;
        } catch (error) {
            logger.error(`Error ${error} at find product by code operation`);
            throw new Error(`Error finding product by code: ${error}`);
        }
    }
}
