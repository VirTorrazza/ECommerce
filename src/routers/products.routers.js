import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, getProductByCode} from "../controllers/products.controller.js";
import { publicRoutes,handlePolicies} from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.get('/', publicRoutes,handlePolicies(['USER', 'ADMIN']),getProducts);

productRouter.get('/code/:code',publicRoutes,handlePolicies(['USER', 'ADMIN']),getProductByCode);

productRouter.get('/:pid',publicRoutes,handlePolicies(['USER', 'ADMIN']),getProductById);

productRouter.post('/',publicRoutes,handlePolicies(['ADMIN']),createProduct);

productRouter.put('/:pid', publicRoutes,handlePolicies(['ADMIN']),updateProduct);

productRouter.delete('/:pid', publicRoutes,handlePolicies(['ADMIN','USER']),deleteProduct);

export default productRouter 