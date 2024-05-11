import {Router} from 'express';
import { privateRoutes,publicRoutes } from '../middlewares/auth.middleware.js';
import userModel from '../models/user.model.js';

const sessionViewsRouter= Router();

sessionViewsRouter.get('/register',(req,res)=>{
    res.render('sessions/register');
})

sessionViewsRouter.get('/', (req,res)=>{
    res.render('sessions/login');
})
sessionViewsRouter.get('/profile', (req, res) => {
    res.render('sessions/profile', req.session.user );
});


export default sessionViewsRouter 