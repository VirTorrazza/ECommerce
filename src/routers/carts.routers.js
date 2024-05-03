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

export default cartRouter 