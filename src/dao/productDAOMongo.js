import CustomError from "../services/errors/CustomError.js";
import productModel from "./models/product.model.js";

export default class ProductDAOMongo{
    constructor(){
        this.model=productModel; 
    }
      
    getAll = async (filters, paginateOptions ) => {
        try{
            let products = await this.model.paginate( filters, paginateOptions );
            return products;
        }catch (error) {
            throw new Error(`Error getting all products: ${error.message}`);
        }
    }

    getById= async (id) =>{ 
        console.log("soy id" +id + typeof(id))
        try {
            const product = await this.model.findById(id);
            return product;
        } catch (error) {
            throw new Error(`Error getting product by ID: ${error.message}`);
        }
    }


    save = async (productData) => {
        try {
            const product = await this.model.create(productData);
            return product;
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    delete = async (id) => {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(id);
            if (!deletedProduct) {
                return { status: 'error', message: 'Product not found', statusCode: 404 };
            }
            return { status: 'success', message: 'Product deleted successfully', statusCode: 200 };
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
    
    update = async (id, newData) => {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(id, newData, { new: true });
            if (!updatedProduct) {
                return { status: 'error', message: 'Product not found', statusCode: 404 };
            }
            return updatedProduct;
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async getByCode(code) {
        try {
            const product = await this.model.findOne({ code: code }).exec();
            return product;
        } catch (error) {
            throw new CustomError({
                name: "DatabaseError",
                message: `Error finding product by code: ${error.message}`,
                cause: error
            });
        }
    }

    async getRealTimeProducts(){
        try {
            const products = await productModel.find().lean().exec();
            return products;
        }catch (error) {
            throw new Error(`Error finding real time products: ${error.message} in ProductDAO`);
        }
    
    }
}