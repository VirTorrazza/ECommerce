import {Router} from 'express';
import passport from 'passport';
import { JWT_COOKIE_NAME } from '../utils.js';

const sessionRouter= Router();

sessionRouter.get('/failRegister', (req,res)=>{
    res.send({error: 'Registration fails'});
})

sessionRouter.get('/failLogin', (req,res)=>{
    res.send({error: 'Login fails'});
})

sessionRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res) => {
});


sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), (req,res)=>{
    res.redirect('/');

})

/*sessionRouter.get('/google', passport.authenticate('github',{scope:['profile','email']}), (req,res) => {
});/ Implementation example  //TODO


/*sessionRouter.get('/googlecallback', passport.authenticate('google', {failureRedirect: '/login', successRedirect: '/'}), (req,res)=>{
    console.log("Inside google callback" + req.user);
    req.session.user= req.user;
    res.redirect('/');

})*/

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), async(req,res)=>{
    res.redirect('/login');
})

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin'}), async(req,res)=>{
    if(!req.user){
        return res.status(400).send({status:'error', error : 'Invalid credentials'});
    }
 
    return res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/');
})

sessionRouter.get('/logout', async(req,res)=>{
   res.clearCookie(JWT_COOKIE_NAME).redirect('/login')
})





export default sessionRouter;