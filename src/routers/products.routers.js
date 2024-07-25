import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, getProductByCode} from "../controllers/products.controller.js";
import { publicRoutes,handlePolicies} from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.get('/',publicRoutes,getProducts);

productRouter.get('/code/:code',publicRoutes,handlePolicies(['USER', 'ADMIN','PREMIUM']),getProductByCode); 

productRouter.get('/:pid',publicRoutes,handlePolicies(['USER', 'ADMIN', 'PREMIUM']),getProductById); 

productRouter.post('/',publicRoutes, handlePolicies(['PREMIUM', 'ADMIN']),createProduct);

productRouter.put('/:pid',publicRoutes,handlePolicies(['ADMIN', 'PREMIUM']),updateProduct); 

productRouter.delete('/:pid',publicRoutes,handlePolicies(['ADMIN', 'PREMIUM']), deleteProduct);

export default productRouter 