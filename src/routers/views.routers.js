import { Router } from "express";
import ProductManager from "../data/productManager.js";

const viewRouter =Router();
const productManager= new ProductManager('./src/data/products.json');


viewRouter.get('/realtimeproducts', async (req, res)=>{
    let products= await productManager.getProducts();
    res.render('realtimeproducts', {products}); // view name
})

viewRouter.get('/', async (req, res)=>{
    let products= await productManager.getProducts();
    res.render('home', {products}); 
})

export default viewRouter;