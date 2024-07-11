import { generateRandomString, JWT_COOKIE_NAME } from '../utils/utils.js';
import logger from "../logger/logger.js";
import userModel from '../dao/models/user.model.js';
import userPasswordModel from '../dao/models/user-password.model.js';
import config from '../config/config.js';
import NodeMailer from 'nodemailer';

export const registrationFailure = (req, res) => {
    logger.error('Registration failed');
    res.status(400).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Registration Failed</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body {
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
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
            .error-message {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .register-link {
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="error-card">
            <h1 class="error-title">Registration Failed</h1>
            <p class="error-message">Failed to register. Please ensure all fields are filled correctly and try again.</p>
            <a href="/login/register" class="btn btn-primary register-link">Go to Registration Page</a>
          </div>
        </body>
        </html>
      `);      
};

export const loginFailure = (req, res) => {
    logger.error('Login failed');
    res.status(401).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Failed</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body {
              background-color: #f8f9fa;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
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
            .error-message {
              font-size: 1.2rem;
              margin-bottom: 20px;
            }
            .login-link {
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="error-card">
            <h1 class="error-title">Login Failed</h1>
            <p class="error-message">Please check your credentials and try again.</p>
            <a href="/login" class="btn btn-primary login-link">Go to Login Page</a>
          </div>
        </body>
        </html>
      `);
      
};

export const redirectToHomePage = (req, res) => {
    res.redirect('/');
};

export const redirectToLogin = async (req, res) => {
    res.redirect('/login');
};

export const handleLogin = async (req, res) => {
    if (!req.user) {
        logger.error('User not found: invalid credentials error');
        return res.status(401).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invalid Credentials</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
              body {
                background-color: #f8f9fa;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
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
              .error-message {
                font-size: 1.2rem;
                margin-bottom: 20px;
              }
              .login-link {
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="error-card">
              <h1 class="error-title">Invalid Credentials</h1>
              <p class="error-message">The username or password you entered is incorrect. Please try again.</p>
              <a href="/login" class="btn btn-primary login-link">Go to Login Page</a>
            </div>
          </body>
          </html>
        `);
        
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token);
    res.redirect('/');
};


export const handleLogout = async (req, res) => {
    logger.debug('Clearing cookie');
    res.clearCookie(JWT_COOKIE_NAME);
    res.redirect('/login');
};

export const passwordRecovery= async(req,res)=>{
  console.log("Holaaa")
  const email= req.body.email;
  const user= await userModel.findOne({email});
  if(!user){
    logger.error(`User with email ${email} not found in passwordRecovery operation`);
     return res.status(404).send(`
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
  const token = generateRandomString(16);

  await userPasswordModel.create({email,token});

  const nodeMailerConfig = {
    service: 'gmail',
    auth: { user: config.nodemailer.user, pass: config.nodemailer.password },
    tls: {
      rejectUnauthorized: false
  }
}
  let transporter = NodeMailer.createTransport(nodeMailerConfig)

  let message = {
    from: config.nodemailer.user,
    to: email,
    subject: '[E-Commerce] Reset your password',
    html: `
        <h1>[E-Commerce] Reset your password</h1>
        <hr />
        <p>You have requested to reset your password.</p>
        <p>You can do it here:</p>
        <p><a href="http://${req.hostname}:${config.apiserver.port}/reset-password//${token}">http://${req.hostname}:${config.apiserver.port}/reset-password//${token}</a></p>
        <hr />
        <p>Best regards,</p>
        <p><strong>The E-Commerce API team</strong></p>
    `
};

    try {
      await transporter.sendMail(message)
      logger.debug(`Email successfully sent to ${email} in order to reset password`);
      res.json({ status: 'success', message: `Email successfully sent to ${email} in order to reset password` })
    } catch (error) {
      logger.error(`error: ${error.message}`);
      res.status(500).send({ status: 'error', error: error.message })
    }
  }

  export const resetPassword = (req,res)=>{
    res.redirect(`/verify-token/${req.params.token}`);
  }

  export const verifyToken = async (req,res)=>{
    const userPassword= await userPasswordModel.findOne({token:req.params.token});
    if(!userPassword){
      return res.status(500).send({ status: 'error', error: "Expired token" })
    }

    const user= userPassword.email;
    res.render('/reset-password', {user})
  }