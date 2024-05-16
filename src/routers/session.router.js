import {Router} from 'express';
import userModel from '../models/user.model.js'
import {isValidPassword } from '../utils.js';
import passport from 'passport';

const sessionRouter= Router();

sessionRouter.get('/failRegister', (req,res)=>{
    res.send({error: 'Registration fails'});
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), async(req,res)=>{
  
    res.redirect('/login');
})

sessionRouter.post('/login', async(req,res)=>{
    const {email, password}= req.body;
    const user= await userModel.findOne({email}).lean().exec();
    if(!user){
        return res.redirect('/login');
    }
    if(user.email === 'admin@admin.com' && user.password ==='admin97843'){
        user.role='admin';
    }
    else{
        user.role='user';
    }

    if(!isValidPassword(user,password)){
        return res.status(401).send({status:'error', error:'Invalid credentials'});

    }
    req.session.user=user;
    res.redirect('/');
})

sessionRouter.get('/logout', async(req,res)=>{
    req.session.destroy(error=>{
        if (error){
            console.log(error);
            res.send(500).render('/errors/base', {error});
        }
        else{
            res.redirect('/login');
        }
    })
})

export default sessionRouter;