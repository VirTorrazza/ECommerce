import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem } from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN']),createCart);
  
cartRouter.get('/:cid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN', 'USER']), getCart); 
  
cartRouter.post('/:cid/product/:pid', publicRoutes, handlePolicies(['USER']),addToCart);

cartRouter.delete('/:cid/products/:pid',publicRoutes, handlePolicies(['USER']), removeFromCart);
  
cartRouter.delete('/:cid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN', 'USER']),clearCart);
  
cartRouter.put('/:cid', publicRoutes, (['PREMIUM', 'ADMIN', 'USER']), updateCart);

cartRouter.put('/:cid/products/:pid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN']), updateCartItem);

cartRouter.get('/:cid/purchase', publicRoutes, handlePolicies(['USER']), purchaseItems);

export default cartRouter 