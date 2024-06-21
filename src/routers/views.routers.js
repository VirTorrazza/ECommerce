import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { passportCall,handlePolicies } from "../utils/utils.js";
import { getHomePage, getRealTimeProducts } from "../controllers/views.controller.js";

const viewRouter =Router();

viewRouter.get('/realtimeproducts', publicRoutes, handlePolicies(['USER', 'ADMIN']), getRealTimeProducts);
//viewRouter.get('/chat', publicRoutes, handlePolicies(['USER']), chatViewController);
viewRouter.get('/', passportCall('jwt'),getHomePage);

export default viewRouter;