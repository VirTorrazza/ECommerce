import { Router } from "express";
import { publicRoutes,handlePolicies } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem ,purchaseItems} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/',createCart);
  
cartRouter.get('/:cid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN', 'USER']), getCart); 
  
cartRouter.post('/:cid/product/:pid',addToCart);

cartRouter.delete('/:cid/products/:pid',publicRoutes, handlePolicies(['USER']), removeFromCart);
  
cartRouter.delete('/:cid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN', 'USER']),clearCart);
  
cartRouter.put('/:cid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN', 'USER']), updateCart);

cartRouter.put('/:cid/products/:pid', publicRoutes, handlePolicies(['PREMIUM', 'ADMIN']), updateCartItem);

cartRouter.get('/:cid/purchase', purchaseItems);

export default cartRouter 