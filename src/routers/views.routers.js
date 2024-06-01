import { Router } from "express";
import { publicRoutes } from "../middlewares/auth.middleware.js";
import { passportCall } from "../utils.js";
import { getHomePage, getRealTimeProducts } from "../controllers/views.controller.js";

const viewRouter =Router();

viewRouter.get('/realtimeproducts', publicRoutes, getRealTimeProducts);
viewRouter.get('/', passportCall('jwt'),getHomePage);

export default viewRouter;