import { Router } from "express";
import cartModel from "../models/carts.model.js";
import productModel from "../models/products.model.js";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem } from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/',publicRoutes, createCart);
  
  
cartRouter.get('/:cid', publicRoutes, getCart);
  

cartRouter.post('/:cid/product/:pid', publicRoutes, addToCart);

cartRouter.delete('/:cid/products/:pid', publicRoutes,removeFromCart);
  
cartRouter.delete('/:cid', publicRoutes, clearCart);
  
cartRouter.put('/:cid', publicRoutes ,updateCart);

cartRouter.put('/:cid/products/:pid', publicRoutes, updateCartItem);

export default cartRouter 