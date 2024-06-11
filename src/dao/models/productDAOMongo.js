import productModel from "./products.model.js";

export default class productDAOMongo{
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
            const product = await this.model.findOne({ code: code });
            console.log ("encontre el producto en el dao " +product);
            return product;
        } catch (error) {
            throw new Error(`Error finding product by code: ${error.message} in ProductDAO`);
        }
    }
}