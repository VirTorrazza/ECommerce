import { JWT_COOKIE_NAME } from '../utils/utils.js';
import logger from "../logger/logger.js";

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