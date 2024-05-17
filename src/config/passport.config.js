import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userModel from '../models/user.model.js';
import {createHash, isValidPassword} from '../utils.js'

const localStrategy= local.Strategy;

const initializePassport=()=>{
    passport.use('register', new localStrategy({
        passReqToCallback:true,
        usernameField:'email'
    }, async (req,username, password, done)=>{
        const{firstName,lastName,email,age} =req.body;
        try{
            const user= await userModel.findOne({email:username});
            if(user){
                return done(null,false);
            }

            const newUser={
                firstName,lastName,email, age, password: createHash(password)
            }
            const result= await userModel.create(newUser);
            return done(null,result);

        }catch(error){
            return done(error);

        }

    }))

    passport.use('login', new localStrategy({
        usernameField:'email',
    }, async (username, password,done)=>{
        try{
            const user= await userModel.findOne({email:username})
            if(!user){
                return done(null,false);
            }
            if(!isValidPassword (user, password)){
                return done(null,false);
            }
            return done(null,user);
        } catch(error){
            return done(error);
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv23livbUtqnTMfyCK1l',
        clientSecret: '9e99fd69d36571463204ed702a3daa6bd1e6cb30',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken,refreshToken,profile,done)=>{
        console.log(profile);
        return done (null,profile);
    }))

    passport.serializeUser((user,done)=>
        done(null,user._id)
    );

    passport.deserializeUser(async(id, done)=>{
        const user=await userModel.findById(id);
        done(null,user);

    });

}

export default initializePassport;