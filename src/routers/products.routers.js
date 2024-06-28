import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, getProductByCode} from "../controllers/products.controller.js";
import { publicRoutes,handlePolicies} from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.get('/',getProducts); 

productRouter.get('/code/:code',getProductByCode);

productRouter.get('/:pid',getProductById);

productRouter.post('/',createProduct);

productRouter.put('/:pid',updateProduct); 

productRouter.delete('/:pid',deleteProduct);

export default productRouter 