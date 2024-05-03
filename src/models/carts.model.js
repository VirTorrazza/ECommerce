import mongoose from "mongoose";

const cartCollection= 'carts';

const cartSchema = new mongoose.Schema({
	products: {
        type:[{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products" // Reference schema
            },
            quantity: Number // Quantity that user wants
        }],
        default: []
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema);
export default cartModel;