import { Router } from "express";
import ProductManager from "../data/productManager.js";
import productModel from "../models/products.model.js";

const viewRouter =Router();
const productManager= new ProductManager('./src/data/products.json');


viewRouter.get('/realtimeproducts', async (req, res)=>{
    let products= await productManager.getProducts();
    res.render('realtimeproducts', {products}); // view name
})

viewRouter.get('/', async (req, res)=>{
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const filters = {};
    if(req.query.category)  filters.category = req.query.category;
    if(req.query.stock)     filters.stock = req.query.stock;
    const paginateOptions = { lean:true, limit, page };
    let productsPaginated= await productModel.paginate({}, paginateOptions);
    console.log(productsPaginated);
    res.render('home', {products}); 

})

export default viewRouter;