import {Router} from 'express';
import passport from 'passport';
import { handleLogin, handleLogout, loginFailure, redirectToLogin, registrationFailure, redirectToHomePage } from '../controllers/session.controller.js';

const sessionRouter= Router();

sessionRouter.get('/failRegister', registrationFailure);

sessionRouter.get('/failLogin', loginFailure);

sessionRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), (req,res) => {
});


sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), redirectToHomePage);

/*sessionRouter.get('/google', passport.authenticate('github',{scope:['profile','email']}), (req,res) => {
});/ Implementation example  //TODO


/*sessionRouter.get('/googlecallback', passport.authenticate('google', {failureRedirect: '/login', successRedirect: '/'}), (req,res)=>{
    console.log("Inside google callback" + req.user);
    req.session.user= req.user;
    res.redirect('/');

})*/

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}),redirectToLogin)

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin'}),handleLogin)

sessionRouter.get('/logout', handleLogout)





export default sessionRouter;