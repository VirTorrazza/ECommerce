import { JWT_COOKIE_NAME } from '../utils/utils.js';
import logger from "../logger/logger.js";

export const registrationFailure = (req, res) => {
    logger.error('Registration failed');
    res.send({ error: 'Registration failed' });
};

export const loginFailure = (req, res) => {
    logger.error('Login failed');
    res.send({error: 'Login failed'});
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
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token);
    res.redirect('/');
};


export const handleLogout = async (req, res) => {
    logger.debug('Clearing cookie');
    res.clearCookie(JWT_COOKIE_NAME);
    res.redirect('/login');
};