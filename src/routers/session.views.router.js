import {Router} from 'express';
import { privateRoutes,publicRoutes } from '../middlewares/auth.middleware.js';

const sessionViewsRouter= Router();

sessionViewsRouter.get('/register',(req,res)=>{
    res.render('sessions/register');
})

sessionViewsRouter.get('/', (req,res)=>{
    res.render('sessions/login');
})

export default sessionViewsRouter 