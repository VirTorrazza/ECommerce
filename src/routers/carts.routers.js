import { Router } from "express";
import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";

const cartRouter = Router();

cartRouter.post('/', async (req, res) => {
    try {
      let newCart = new cartModel({
        products: []
      });

      let savedCart = await newCart.save();
      return res.status(201).json({ payload: savedCart });

    } catch (error) {
      console.error("Error creating cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  cartRouter.get('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid;
    
        const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "404: Cart not found" });
      }
  
      return res.status(200).json({ payload: cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

cartRouter.post('/:cid/product/:pid', async (req,res)=>{

    try {
        const cid = req.params.cid;
        const pid= req.params.pid;
        const cart = await cartModel.findById(cid);
      if (!cart) {
        return res.status(404).json({ error: "404: Cart not found" });
      }
      let updatedProductIndex = cart.products.findIndex(prod => {
        return (prod.product.toString() === pid)});

    if (updatedProductIndex === -1) {
        cart.products.push({product:pid,quantity:1})
        const updatedCart = await cartModel.findByIdAndUpdate(
            cart._id,
            cart,
            { returnDocument: 'after' }
          );
          return res.status(200).json({ payload:updatedCart });
    }
        cart.products[updatedProductIndex].quantity+=1

        let result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' });
        return res.status(200).json({ payload: result });

    } catch (error) {
      console.error("Error fetching cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const cart = await cartModel.findById(req.params.cid);
      if (!cart) {
        return res.status(404).json({ error: "404: Cart not found" });
      }
  
      const searchedProduct = await productModel.findById(req.params.pid);
      if (!searchedProduct) {
        return res.status(404).json({ error: "404: Product not found" });
      }
      cart.products = cart.products.filter(item => item.product.toString() !== req.params.pid);
  
      const updatedCart = await cartModel.findByIdAndUpdate(
        cart._id,
        { products: cart.products },
        { returnDocument: 'after' }
      );
  
      return res.status(200).json({ payload: updatedCart });
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
cartRouter.delete('/:cid', async (req, res) => {
    try {
      const cart = await cartModel.findById(req.params.cid);
      if (!cart) return res.status(404).json({ error: "404: Cart not found" });
      cart.products = [];
      const updatedCart = await cartModel.findByIdAndUpdate(cart._id,{ products: cart.products },{ returnDocument: 'after' });
      return res.status(200).json({ payload: updatedCart });

    } catch (error) {
      console.error("Error deleting products from cart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

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
            return (prod.product.toString() === pid)});

        if (updatedProductIndex === -1) {
            return res.status(404).json({ error: "404: Product not found" });
        }
        
        cart.products[updatedProductIndex].quantity = req.body.quantity; 

        let result = await cartModel.findByIdAndUpdate(cid, cart, { returnDocument: 'after' });

        return res.status(200).json({ payload: result });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
});

export default cartRouter 