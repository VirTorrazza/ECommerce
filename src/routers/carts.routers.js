import { Router } from "express";
import { publicRoutes,handlePolicies } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem ,purchaseItems} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/',createCart);
  
cartRouter.get('/:cid', getCart); 
  
cartRouter.post('/:cid/product/:pid',addToCart);

cartRouter.delete('/:cid/product/:pid', removeFromCart); 
  
cartRouter.delete('/:cid',clearCart); 
  
cartRouter.put('/:cid', updateCart);

cartRouter.put('/:cid/products/:pid',updateCartItem);

cartRouter.get('/:cid/purchase', purchaseItems);

export default cartRouter 