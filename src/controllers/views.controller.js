import productDAOMongo from "../dao/productDAOMongo.js";
import ProductsService from "../services/products.service.js";
import config from "../config/config.js";
import { generateMockedProduct } from "../utils/utils.js";

const PORT =config.apiserver.port;
const dao= new productDAOMongo();
const service = new ProductsService();

export async function getRealTimeProducts (req, res){
    const products = await service.getRealTimeProducts();
    console.log("productos"+ JSON.stringify(products))
    res.render('realtimeproducts', {products}); // view name
}


export function getMockedProducts(req, res) {
    try {
        const numberOfProducts = 10; 
        const mockedProducts = [];

        for (let index = 0; index < numberOfProducts; index++) {
            mockedProducts.push(generateMockedProduct());
        }

        return res.status(200).json({ payload: mockedProducts });
    } catch (error) {
        console.error('Error generating mocked products:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getHomePage (req, res){
    let status;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const filters = {};
    if(req.query.category)  filters.category = req.query.category;
    if(req.query.stock)     filters.stock = req.query.stock;
    const paginateOptions = { lean:true, limit, page };
    if(req.query.sort === 'asc') paginateOptions.sort = {price : 1};
    if(req.query.sort === 'desc') paginateOptions.sort = {price : -1};
    let productsPaginated= await service.getAll({}, paginateOptions)
    //await productModel.paginate({}, paginateOptions);
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

    const user= req.user.user;
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
}