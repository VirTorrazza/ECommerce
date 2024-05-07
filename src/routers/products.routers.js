import { Router } from "express";
import ProductManager from "../data/productManager.js";
import productModel from "../models/products.model.js";

const productRouter = Router();
const productManager= new ProductManager('./src/data/products.json');


productRouter.get('/', async (req, res)=>{
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
        return res.status(404).json ({error: "404: Resource not found"})
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

    let result ={
        status,
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
    }
    return res.status(200).json({payload:result});
   
})

productRouter.get('/:pid', async (req,res)=>{ //products/
    try{
        let pid= req.params.pid;
        let product= await productModel.findById(pid);
        if (!product) {
            return res.status(404).json({ error: "404: Product not found" });
          }
        
    return res.status(200).json({payload:product});
    }catch(error){
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
   
})

productRouter.post('/', async (req,res)=>{
    try{
        let { title, description, code, price, stock, category, thumbnails } = req.body;
        
        if (!title || !code || !price || !stock || !category||!description) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let existingProduct = await productModel.findOne({ code });

        if (existingProduct) {
            return res.status(400).json({ error: "Product with this code already exists" });
        }

        let newProduct = new productModel({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails
        });

        await newProduct.save();
        return res.status(201).json({ message: "Product created successfully", product: newProduct });

    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' })
}
})

productRouter.put('/:pid', async (req,res)=>{
    try{
        let product= req.body;
        let id= parseInt(req.params.pid);
        let newProduct= await productManager.updateProduct(id,product);
        if (typeof newProduct === 'string' && newProduct.startsWith('Error')) {
            return res.status(400).json({ error: "Product does not exist" });
        } else {
            return res.status(201).json({ message: 'Product updated successfully', payload: newProduct });
        }
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' })
}
}
)

productRouter.delete('/:pid', async (req,res)=>{
    let pid= parseInt(req.params.pid);
    let newProducts=await productManager.deleteProduct(pid);
    try{
        if (typeof newProducts === 'string' && newProducts.startsWith('Error')) {
            return res.status(400).json({ error: "The product cannot be deleted because it does not exist" });
        } else {
            return res.status(204).end();
        }
    }catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
}

})

export default productRouter 