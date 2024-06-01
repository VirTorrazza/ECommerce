import { JWT_COOKIE_NAME } from '../utils.js';

export const registrationFailure = (req, res) => {
    res.send({ error: 'Registration fails' });
};

export const loginFailure = (req, res) => {
    res.send({error: 'Login fails'});
};

export const redirectToHomePage = (req, res) => {
    res.redirect('/');
};

export const redirectToLogin = async (req, res) => {
    res.redirect('/login');
};

export const handleLogin = async (req, res) => {
    if (!req.user) {
        return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }

    res.cookie(JWT_COOKIE_NAME, req.user.token);
    res.redirect('/');
};


export const handleLogout = async (req, res) => {
    res.clearCookie(JWT_COOKIE_NAME);
    res.redirect('/login');
};