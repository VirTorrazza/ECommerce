import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, getProductByCode} from "../controllers/products.controller.js";
import { publicRoutes,handlePolicies} from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.get('/',handlePolicies(['USER', 'ADMIN', 'PREMIUM']),getProducts); // FUNCIONA

productRouter.get('/code/:code',publicRoutes,handlePolicies(['USER', 'ADMIN','PREMIUM']),getProductByCode); //FUNCIONA

productRouter.get('/:pid',publicRoutes,handlePolicies(['USER', 'ADMIN', 'PREMIUM']),getProductById); // FUNCIONA

productRouter.post('/',publicRoutes,handlePolicies(['PREMIUM', 'ADMIN']),createProduct);

productRouter.put('/:pid',publicRoutes,handlePolicies(['ADMIN', 'PREMIUM']),updateProduct); 

productRouter.delete('/:pid',publicRoutes,handlePolicies(['ADMIN', 'PREMIUM']), deleteProduct);

export default productRouter 