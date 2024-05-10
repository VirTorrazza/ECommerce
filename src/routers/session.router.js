import {Router} from 'express';
import userModel from '../models/user.model.js'

const sessionRouter= Router();

sessionRouter.post('/register', async(req,res)=>{
    let userToRegister= req.body;
    let user = new userModel(userToRegister);
    await user.save();
    res.redirect('/login');
})

sessionRouter.post('/login', async(req,res)=>{
    const {email, password}= req.body;
    const user= await userModel.findOne({email,password}).lean().exec();
    if(!user){
        return res.redirect('/login');
    }
    if(user.email === 'admin@admin.com' && user.password ==='admin97843'){
        user.role='admin';
    }
    else{
        user.role='user';
    }
    req.session.user=user;
    res.redirect('/products');
})

