import mongoose from "mongoose";

const ticketsCollection = 'tickets'; 
const ticketSchema = new mongoose.Schema({
	code: {
        type: String,
        unique: true,
        required: true
    },
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            price: Number,
            quantity: Number
        }]
    },
    purchaser:{ type: String, ref: "users" },
    amount: { type: Number }, 
}, 
{
    timestamps: {
        createdAt: 'purchase_datetime'
    }
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

export default ticketModel;
