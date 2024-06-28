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
            const cart = await this.model.findById(id);
            return cart;
    }

    update = async (cid, newData) => {
            const updatedCart = await this.model.findByIdAndUpdate(cid, newData, { new: true });
            return updatedCart;
    }

}