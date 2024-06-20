import mongoose from "mongoose";

const cartCollection= 'carts';

const cartSchema = new mongoose.Schema({
	products: {  //products [{product,quantity}]
        type:[{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId, // I cannot access mongoDB reserved words type and
                ref: "products" // Reference schema
            },
            quantity: Number // Quantity that user wants
        }],
        default: []
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;