import cartModel from "./carts.model.js";

export default class cartDAOMongo{
    constructor(){
        this.model=cartModel; 
    }
      

    getById= async (id) =>{ 
        try {
            const cart = await this.model.findById(id);
            return cart;
        } catch (error) {
            throw new Error(`Error getting cart by ID: ${error.message} in cartDAO`);
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
            throw new Error(`Error updating cart: ${error.message}`);
        }
    }

}