import {Router} from 'express';
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from '../utils.js';

const sessionRouter= Router();

sessionRouter.post('/register', async(req,res)=>{
    try {
        let userToRegister = req.body;
        userToRegister.password= createHash(userToRegister.password); //Hash password
        const user= new userModel(userToRegister);
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Error occurred while saving user:", error);
        res.status(500).send("Internal Server Error");
    }
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