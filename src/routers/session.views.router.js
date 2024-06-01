import {Router} from 'express';
import { showLoginPage, showProfilePage, showRegisterPage } from '../controllers/sessions.views.controller.js';

const sessionViewsRouter= Router();

sessionViewsRouter.get('/register',showRegisterPage);

sessionViewsRouter.get('/', showLoginPage);

sessionViewsRouter.get('/profile',showProfilePage);

export default sessionViewsRouter 