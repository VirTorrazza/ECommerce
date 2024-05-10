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
    try {
        const newUser = {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            age: 30,
            role: "user"
        };

        res.render('sessions/profile', {user: newUser});
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Error creating user");
    }
});


export default sessionViewsRouter 