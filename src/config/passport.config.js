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
        clientID:'Iv23li4SNU3OKXjlZYyW',
        clientSecret:'7152f5a1d7a9254f08e342592ec3c4a1bb17a91a',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done)=>{
        
        try{
            const user = await userModel.findOne({email:profile._json.email});//await usersModel.findOne({email:profile._json.email});
            if(user) return done(null,user);

            const newUser = await userModel.create({ //await usersModel.create({
                firstName:profile._json.name,
                lastName:'',
                email:profile._json.email,
                password:''
            });
             
            done(null,newUser);

        }catch(error){
            return done('Error to login with github');
        }
        
    }));


    passport.serializeUser((user,done)=>
        done(null,user._id)
    );

    passport.deserializeUser(async(id, done)=>{
        const user=await userModel.findById(id);
        done(null,user);

    });

}

export default initializePassport;