import CustomError from "../services/errors/CustomError.js";
import productModel from "./models/product.model.js";
import logger from "../logger/logger.js";

export default class ProductDAOMongo{
    constructor(){
        this.model=productModel; 
    }
      
    getAll = async (filters, paginateOptions ) => {
        try{
            let products = await this.model.paginate( filters, paginateOptions );
            return products;
        }catch (error) {
            logger.error(`Error getting all products in productDAOMongo: ${error.message}`);
            throw new Error(`Error getting all products: ${error.message}`);
        }
    }

    getById= async (id) =>{ 
        try {
            const product = await this.model.findById(id);
            logger.debug(`Successfull retrieval of product with ID: ${id}`);
            return product;
        } catch (error) {
            logger.error(`Error getting product by ID: ${error.message} in productDAOMongo`);
            throw new Error(`Error getting product by ID: ${error.message}`);
        }
    }


    save = async (productData) => {
        try {
            const product = await this.model.create(productData);
            logger.debug("Await product creation in productDAOMongo...");
            return product;
        } catch (error) {
            logger.error(`Error creating product: ${error.message} in productDAOMongo`);
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(id);
            if (!deletedProduct) {
                logger.error(`Error getting product with ID ${id} in productDAOMongo. Product does  not exists`);
                return { status: 'error', message: 'Product not found', statusCode: 404 };
            }
            logger.debug("Product deleted");
            return { status: 'success', message: 'Product deleted successfully', statusCode: 200 };
        } catch (error) {
            logger.error(`Error:${error.message} in productDAOMongo`);
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
    
    update = async (id, newData) => {
            const updatedProduct = await this.model.findByIdAndUpdate(id, newData, { new: true });
            return updatedProduct;
    }

    async getByCode(code) {
        try {
            const product = await this.model.findOne({ code: code }).exec();
            logger.debug("Product found in getByCode operation");
            return product;
        } catch (error) {
            logger.error(`Error finding product by code: ${code} in productDAOMongo`);
            throw new CustomError({
                name: "DatabaseError",
                message: `Error finding product by code: ${error.message}`,
                cause: error
            });
        }
    }

    async getRealTimeProducts(){
        try {
            const products = await this.model.find().lean().exec();
            logger.debug("Products found");
            return products;
        }catch (error) {
            logger.error(`Error finding real time products: ${error.message} in productDAOMongo`);
            throw new Error(`Error finding real time products: ${error.message} in productDAOMongo`);
        }
    
    }
}