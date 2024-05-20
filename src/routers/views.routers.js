import { Router } from "express";
import productModel from "../models/products.model.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";

const viewRouter =Router();
const PORT =8080;

viewRouter.get('/realtimeproducts', publicRoutes, async (req, res)=>{
    const products = await productModel.find().lean().exec();
    res.render('realtimeproducts', {products}); // view name
})


viewRouter.get('/', publicRoutes, async (req, res)=>{
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
    if (productsPaginated){
        status= "success";
    }
    else{
        status="error"
    }

    let prevLink;
    if(!req.query.page){
        prevLink = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${productsPaginated.prevPage}`;
    }else{
        let urlMod = req.originalUrl.replace(`page=${req.query.page}`,`page=${productsPaginated.prevPage}`);
        prevLink = `http://${req.hostname}:8080${urlMod}`;
    }

    let nextLink;
    if(!req.query.page){
        nextLink = `http://${req.hostname}:8080${req.originalUrl}&page=${productsPaginated.nextPage}`;
    }else{
        let urlMod = req.originalUrl.replace(`page=${req.query.page}`,`page=${productsPaginated.nextPage}`);
        nextLink = `http://${req.hostname}:8080${urlMod}`;
    }

    let totalPages = productsPaginated.totalPages;
    let currentPage = productsPaginated.page;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push({
            page: i,
            link: `http://localhost:8080?page=${i}`,
            isActive: i === currentPage
        });
    }

    const user= req.session.user;
    res.render('home', {
        status,
        user,
        products: productsPaginated.docs,
        paginateInfo: {
            totalPages,
            page: currentPage,
            hasPrevPage: productsPaginated.hasPrevPage,
            hasNextPage: productsPaginated.hasNextPage,
            prevLink,
            nextLink
        },
        pages
    });
    

})

export default viewRouter;