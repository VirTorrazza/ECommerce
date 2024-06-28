import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { passportCall,handlePolicies } from "../utils/utils.js";
import { getHomePage, getRealTimeProducts, getMockedProducts} from "../controllers/views.controller.js";
import { getChatPage } from "../controllers/chat.controller.js";

const viewRouter =Router();

viewRouter.get('/realtimeproducts', publicRoutes, handlePolicies(['USER', 'ADMIN']), getRealTimeProducts);

viewRouter.get('/', publicRoutes, passportCall('jwt'), getHomePage);

viewRouter.get('/chat', publicRoutes,handlePolicies(['USER']),getChatPage);

viewRouter.get('/mockedproducts',getMockedProducts);

export default viewRouter;