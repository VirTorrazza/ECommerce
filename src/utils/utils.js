import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import {faker} from'@faker-js/faker';
import logger from "../logger/logger.js"

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
            if (!user){
                logger.error("User not found");
                return res.status(401).send(`
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Error</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    <style>
                      body {
                        background-color: #f8f9fa;
                      }
                      .error-container {
                        height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      }
                      .error-card {
                        max-width: 400px;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        background-color: #ffffff;
                        text-align: center;
                      }
                      .error-title {
                        font-size: 2rem;
                        font-weight: bold;
                        color: #dc3545;
                        margin-bottom: 20px;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="error-container">
                      <div class="error-card">
                        <h1 class="error-title">Error</h1>
                        <p class="text-muted">User not found. Please check your credentials.</p>
                        <a href="/login" class="btn btn-primary">Login</a>
                      </div>
                    </div>
                  </body>
                  </html>
                `);      
            } 
            req.user = user
            next();
        })(req,res,next)
    }
}
export const handlePolicies = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next();
    const user = req.user || null;
    logger.debug(`User in policies: ${user}`);
    if( !policies.includes(user.role.toUpperCase()) ) {
        logger.error(`${user} not authorized`);
        return res.status(403).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error: Need Auth</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                body {
                  background-color: #f8f9fa;
                }
                .error-container {
                  height: 100vh;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                .error-card {
                  max-width: 400px;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                  background-color: #ffffff;
                  text-align: center;
                }
                .error-title {
                  font-size: 2rem;
                  font-weight: bold;
                  color: #dc3545;
                  margin-bottom: 20px;
                }
              </style>
            </head>
            <body>
              <div class="error-container">
                <div class="error-card">
                  <h1 class="error-title">Error: Need Auth</h1>
                  <p class="text-muted">You are not authorized to access this resource.</p>
                  <a href="/login" class="btn btn-primary">Login</a>
                </div>
              </div>
            </body>
            </html>
          `);
          
    }
    return next();
}

export const generateMockedProduct=()=>{
    const numberOfImages = faker.number.int({ min: 1, max: 5 }); // faker will generate between 1 to 5 images per product
    const images = Array.from({ length: numberOfImages }, () => faker.image.imageUrl());
    return {
        _id: faker.string.uuid(),
        title:faker.commerce.productName(),
        description:faker.commerce.productDescription(),
        code: faker.number.int(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int(),
        category: faker.commerce.productAdjective(),
        thumbnails: images,
    }

}

