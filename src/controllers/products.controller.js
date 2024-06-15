import config from "../config/config.js";
import productDAOMongo from "../dao/models/productDAOMongo.js";
import productModel from "../dao/models/products.model.js";
import ProductsService from "../services/products.service.js";

const PORT =config.apiserver.port;
const dao= new productDAOMongo(productModel);
const service = new ProductsService(dao);

export async function getProducts (req, res){
    let status;
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const filters = {};
    if(req.query.category)  filters.category = req.query.category;
    if(req.query.stock)     filters.stock = req.query.stock;
    const paginateOptions = { lean:true, limit, page };
    if(req.query.sort === 'asc') paginateOptions.sort = {price : 1};
    if(req.query.sort === 'desc') paginateOptions.sort = {price : -1};
    let productsPaginated= await service.getAll({}, paginateOptions);
    //productModel.paginate({}, paginateOptions);
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
   
}

export async function getProductById(req,res){ 
    try{
        let pid= req.params.pid;
        let product= await service.getById(pid); 
        if (!product) {
            return res.status(404).json({ error: "404: Product not found" });
          }
        
    return res.status(200).json({payload:product});
    }catch(error){
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
   
}

export async function getProductByCode(req,res){
    try{
        let code= req.params.code;
        let product= await service.getByCode(code); 
        if (!product) {
            return res.status(404).json({ error:`404: Product with code ${code} not found`});
          }
        
    return res.status(200).json({payload:product});
    }catch(error){
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function createProduct(req, res) {
    try {
        let { title, description, code, price, stock, category, thumbnails } = req.body;
        
        if (!title || !code || !price || !stock || !category || !description) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        let existingProduct = await service.getByCode({ code });
        // productModel.findOne({ code });

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

        await service.save(newProduct);
        return res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function updateProduct(req, res) {
    try {
        let updateFields = {};
        if (req.body.title) updateFields.title = req.body.title;
        if (req.body.description) updateFields.description = req.body.description;
        if (req.body.code) updateFields.code = req.body.code;
        if (req.body.price) updateFields.price = req.body.price;
        if (req.body.stock) updateFields.stock = req.body.stock;
        if (req.body.category) updateFields.category = req.body.category;
        if (req.body.thumbnails) updateFields.thumbnails = req.body.thumbnails;

        let pid = req.params.pid;
        console.log("HERE")
        let updatedProduct = await service.update(pid,updateFields);
        console.log("updated product"+ JSON.stringify(updatedProduct))
        // productModel.findByIdAndUpdate(pid, updateFields, { returnDocument: 'after' });

        return res.status(200).json({ payload: updatedProduct });
        
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function deleteProduct (req,res){
    try{
        let pid= req.params.pid;
        try {
            let product=await service.getById(pid);
            //productModel.findById(pid);
            if(!product) return res.status(404).json ({error: "404: Product not found"})

        } catch(error){
            return res.status(404).json ({error: "404: Parser Error.Cast Error"+ error});
        }
        await service.delete(pid);
        //productModel.findByIdAndDelete(pid);
        return res.status(200).json({ message: "Product deleted successfully" });

    } catch (error){
        return res.status(500).json({ error: 'Internal Server Error' });
}

}

