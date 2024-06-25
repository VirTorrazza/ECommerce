import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { passportCall,handlePolicies } from "../utils/utils.js";
import { getHomePage, getRealTimeProducts } from "../controllers/views.controller.js";
import { getChatPage } from "../controllers/chat.controller.js";

const viewRouter =Router();

viewRouter.get('/realtimeproducts', publicRoutes, handlePolicies(['USER', 'ADMIN']), getRealTimeProducts);

viewRouter.get('/', publicRoutes, passportCall('jwt'), getHomePage);

viewRouter.get('/chat', getChatPage);

export default viewRouter;