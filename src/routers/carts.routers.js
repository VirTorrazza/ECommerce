import { Router } from "express";
import CartManager from "../data/cartManager.js";
import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";


const cartRouter = Router();
let cartManager= new CartManager('./src/data/carts.json');



cartRouter.post('/', async (req,res)=>{
    let cart= await cartManager.createCart();
    if(!cart) return res.status(404).json ({error: "404: Resource not found"})
    return res.status(200).json({payload:cart})
})

cartRouter.get('/:cid', async (req,res)=>{
    let cart = await cartManager.getCartById(parseInt(req.params.cid));
    if(!cart) return res.status(404).json ({error: "404: Resource not found"})
    let products= cart.products;
    return res.status(200).json({payload:products});
    
})

cartRouter.post('/:cid/product/:pid', async (req,res)=>{
    
    let cart= await cartManager.addProductCartById(req.params.cid,req.params.pid);
    if(typeof cart=== 'string') return res.status(404).json ({error: "404: Resource not found"});
    return res.status(200).json({ payload: cart, message: "Product updated successfully" });
   
})

cartRouter.delete('/:cid/products/:pid', async (req,res)=>{
    
    let cart= await cartModel.findById(req.params.cid);
    let searchedProduct= productModel.findById(req.params.pid);
    if(!cart) return res.status(404).json ({error: "404: Cart not found"});
    if(!searchedProduct) return res.status(404).json ({error: "404: Product not found"});
    cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);
    let updatedCart=await cartModel.findByIdAndUpdate(cart._id,cart,{returnDocument:'after'});
    return res.status(200).json({payload:updatedCart})
})


cartRouter.put('/:cid', async (req,res)=>{
    try{
        let cart;
        let cid= req.params.cid;
        
        try {
            cart= await cartModel.findById(cid); 
            if(!cart) return res.status(404).json ({error: "404: Cart not found"})

        } catch(error){
            return res.status(404).json ({error: "404: Parser Error.Cast Error"+ error});
        }

        cart.products= req.body.products;
        let result = await cartModel.findByIdAndUpdate(cid,cart, {returnDocument:'after'});
        return res.status(200).json({payload:result})
    }catch(error){
        return res.status(504).json({error:"Internal Server Error"})
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "404: Cart not found" });
        }

        let updatedProductIndex = cart.products.findIndex(prod => {
            console.log("prod" + prod);
            console.log("Product ID:", prod._id);
            console.log("Requested PID:", pid);
            return (prod.product._id.toString() === pid)});

        console.log("soy updatedProductIndex" + updatedProductIndex)
        if (updatedProductIndex === -1) {
            return res.status(404).json({ error: "404: Product not found" });
        }
        let updatedProduct = { ...cart.products[updatedProductIndex] };
        updatedProduct.quantity = req.body.products.quantity;
        cart.products[updatedProductIndex] = updatedProduct;

        let result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' });

        return res.status(200).json({ payload: result });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

export default cartRouter 