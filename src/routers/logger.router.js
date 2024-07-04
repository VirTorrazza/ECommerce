import {Router} from 'express';

const loggerRouter= Router();

loggerRouter.get('/', printLoggerTests);


export default loggerRouter;