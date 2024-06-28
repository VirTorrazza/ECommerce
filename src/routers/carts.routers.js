import { Router } from "express";
import { publicRoutes,handlePolicies } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem ,purchaseItems} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/', publicRoutes,handlePolicies(['USER', 'ADMIN', 'PREMIUM']),createCart);
  
cartRouter.get('/:cid',publicRoutes,handlePolicies(['USER', 'ADMIN', 'PREMIUM']), getCart); 
  
cartRouter.post('/:cid/product/:pid',publicRoutes, handlePolicies(['USER']),addToCart);

cartRouter.delete('/:cid/product/:pid',publicRoutes, handlePolicies(['USER']),removeFromCart); 
  
cartRouter.delete('/:cid',publicRoutes, handlePolicies(['ADMIN','PREMIUM']),clearCart); 
  
cartRouter.put('/:cid', publicRoutes, handlePolicies(['USER']),updateCart);

cartRouter.put('/:cid/products/:pid', publicRoutes,handlePolicies(['USER']),updateCartItem);

cartRouter.get('/:cid/purchase', publicRoutes,handlePolicies(['USER']),purchaseItems);

export default cartRouter 