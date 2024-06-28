import { Router } from "express";
import { publicRoutes,handlePolicies } from "../middlewares/auth.middleware.js";
import { addToCart, clearCart, createCart, getCart, removeFromCart, updateCart, updateCartItem ,purchaseItems} from "../controllers/carts.controller.js";

const cartRouter = Router();

cartRouter.post('/',createCart);//FUNCIONA
  
cartRouter.get('/:cid', getCart); //FUNCIONA
  
cartRouter.post('/:cid/product/:pid',addToCart);//FUNCIONA

cartRouter.delete('/:cid/product/:pid', removeFromCart); //FUNCIONA
  
cartRouter.delete('/:cid',clearCart); //FUNCIONA
  
cartRouter.put('/:cid', updateCart);// FUNCIONA

cartRouter.put('/:cid/products/:pid',updateCartItem);//FUNCIONA

cartRouter.get('/:cid/purchase', purchaseItems);

export default cartRouter 