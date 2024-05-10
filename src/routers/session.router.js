import {Router} from 'express';
import userModel from '../models/user.model.js'

const sessionRouter= Router();

sessionRouter.post('/register', async(req,res)=>{
    try {
        let userToRegister = req.body;
        console.log("Request Body:", JSON.stringify(req.body));
        let user = new userModel(userToRegister);
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error("Error occurred while saving user:", error);
        res.status(500).send("Internal Server Error");
    }
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
    res.redirect('api/products');
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