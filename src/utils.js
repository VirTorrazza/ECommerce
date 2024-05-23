import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

export const JWT_PRIVATE_KEY="secret";
export const JWT_COOKIE_NAME= "userAuthCookie";

export const createHash= password =>bcrypt.hashSync(password,bcrypt.genSaltSync(10));

export const isValidPassword = (user, password)=> bcrypt.compareSync(password,user.password);

export const generateToken = user => jwt.sign({user}, JWT_PRIVATE_KEY, { expiresIn: '24h' });

export const extractCookie= req=> (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] :null;

export const passportCall = strategy => {
    return async ( req, res, next ) => {
        passport.authenticate( strategy, function( err, user, info ){
            if (err) return next(err);
            if (!user) return res.status(401).send('<h1>Error</h1>');
            req.user = user
            next();
        })(req,res,next)
    }
}
export const handlePolicies = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next();

    const user = req.user || null;
    console.log('user in policies'+user)
    if( !policies.includes(user.role.toUpperCase()) ) 
    {
        return res.status(403).send('<h1>Error: Need Auth</h1>');
    }

    return next();
}


