import passport from 'passport';
import local from 'passport-local';
import userModel from '../models/user.model.js';
import {createHash} from '../utils.js'

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

    passport.serializeUser((user,done)=>
        done(null,user._id)
    );

    passport.deserializeUser(async(id, done)=>{
        const user=await userModel.findById(id);
        done(null,user);

    });

}

export default initializePassport;