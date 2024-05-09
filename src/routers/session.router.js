import {Router} from 'express';
import { privateRoutes,publicRoutes } from '../middlewares/auth.middleware.js';

const sessionRouter= Router();

sessionRouter.get('/register',privateRoutes, (req,res)=>{
    res.render('sessions/register');
})

sessionRouter.get('/',privateRoutes, (req,res)=>{
    res.render('sessions/login');
})