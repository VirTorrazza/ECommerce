import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct, getProductByCode} from "../controllers/products.controller.js";
import { publicRoutes} from '../middlewares/auth.middleware.js';

const productRouter = Router();

productRouter.get('/',publicRoutes,getProducts);

productRouter.get('/code/:code',publicRoutes, getProductByCode);

productRouter.get('/:pid',publicRoutes,getProductById);

productRouter.post('/',publicRoutes,createProduct);

productRouter.put('/:pid', publicRoutes, updateProduct);

productRouter.delete('/:pid', publicRoutes, deleteProduct);

export default productRouter 