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
    let status;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const filters = {};
    if(req.query.category)  filters.category = req.query.category;
    if(req.query.stock)     filters.stock = req.query.stock;
    const paginateOptions = { lean:true, limit, page };
    if(req.query.sort === 'asc') paginateOptions.sort = {price : 1};
    if(req.query.sort === 'desc') paginateOptions.sort = {price : -1};
    let productsPaginated= await productModel.paginate({}, paginateOptions);
    if (!productsPaginated){
        status= "success";
    }
    else{
        status="error"
    }
    console.log(productsPaginated);
    res.render('home', {
        status,
        products: productsPaginated.docs,
        totalPages: productsPaginated.totalPages,
        prevPage: "http//localhost:8080",
        nextPage: "http//localhost:8080",
        page: productsPaginated.page,
        hasPrevPage: productsPaginated.hasPrevPage,
        hasNextPage: productsPaginated.hasNextPage,
        prevLink: null,
        nextLink: "link"

    }); 

})

export default viewRouter;