import {Router} from 'express';
import { showLoginPage, showProfilePage, showRegisterPage, showForgetPasswordPage } from '../controllers/sessions.views.controller.js';

const sessionViewsRouter= Router();

sessionViewsRouter.get('/register',showRegisterPage);

sessionViewsRouter.get('/',showLoginPage);

sessionViewsRouter.get('/profile',showProfilePage);

sessionViewsRouter.get('/forget-password',showForgetPasswordPage);

export default sessionViewsRouter 