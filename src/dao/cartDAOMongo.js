import cartModel from "./models/cart.model.js";

export default class CartDAOMongo{
    constructor(){
        this.model=cartModel; 
    }
      

    createCart= async()=> {
        try {
            let newCart = new cartModel({
                products: []
            });
            return await newCart.save();
        } catch (error) {
            throw new Error(`Error creating cart in DAO: ${error.message}`);
        }
    }

    getById= async (id) =>{ 
        try {
            const cart = await this.model.findById(id);
            return cart;
        } catch (error) {
            throw new Error(`Error getting cart by ID: ${error.message} in DAO`);
        }
    }

    update = async (cid, newData) => {
        try {
            const updatedCart = await this.model.findByIdAndUpdate(cid, newData, { new: true });
            if (!updatedCart) {
                return { status: 'error', message: 'Cart not found', statusCode: 404 };
            }
            return updatedCart;
        } catch (error) {
            throw new Error(`Error updating cart un DAO: ${error.message}`);
        }
    }

}