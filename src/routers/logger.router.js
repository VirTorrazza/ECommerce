import {Router} from 'express';
import { printLoggerTests } from '../controllers/logger.controller.js';

const loggerRouter= Router();

loggerRouter.get('/', printLoggerTests);


export default loggerRouter;