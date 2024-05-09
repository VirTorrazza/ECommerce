import {Router } from 'express';
import {auth} from '../middlewares/auth.middleware.js'

const userRouter= Router();

userRouter.get('/', (req,res)=>{
    const user={
        username:'martin',
        role: 'user'
    }
    req.session.user=user;
    res.send('Ok');
})

userRouter.get('/private', auth, (req,res)=>{
    res.render('home');
})

userRouter.get('/logout', (req,res)=>{
    req.session.destroy(error=>{
        if(error) return res.send('Logout error');
        return res.send('Logout ok');
    })
})

export default userRouter 