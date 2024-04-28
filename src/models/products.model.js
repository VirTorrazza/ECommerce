import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection= 'products';
const productSchema= new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        required: true,
        unique : true
    },
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String], //An array of strings
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollection, productSchema);

export default productModel;
