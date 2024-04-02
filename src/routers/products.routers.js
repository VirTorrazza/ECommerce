
import { Router } from "express";
import ProductManager from "../data/productManager.js";

const productRouter = Router();
const productManager= new ProductManager('./src/data/products.json');


productRouter.get('/', async (req, res)=>{   //products/
    let result = await productManager.getProducts();
    if(!result) return res.status(404).json ({error: "404: Resource not found"})
    return res.status(200).json({payload:result});
 
})

productRouter.get('/:pid', async (req,res)=>{ //products/
   let id= parseInt(req.params.pid);
   let result = await productManager.getProductById(id);
   if(!result) return res.status(404).json ({error: "404: Product not found"})
   return res.status(200).json({payload:result});
})

productRouter.post('/', async (req,res)=>{
    try{
        let product= req.body;
        let newProduct= await productManager.addProduct(product);
        if (typeof newProduct === 'string' && newProduct.startsWith('Error')) {
            return res.status(400).json({ error: newProduct });
        } else {
            return res.status(201).json({ message: 'Product added successfully', payload: newProduct });
        }
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