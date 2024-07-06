 import UserDTO from "../dto/users.dto.js";
 import logger from "../logger/logger.js";
 
 export const showRegisterPage = (req, res) => {
    res.render('sessions/register');
};

export const showLoginPage= (req,res)=>{
    res.render('sessions/login');
}

export const showProfilePage = (req, res) => {
    if (req.user) {
        const userDTO = new UserDTO(req.user);
        res.render('sessions/profile', userDTO);
    } else {
        logger.error('User not found. Cannot show profile page');
        res.status(404).send('User not found');
    }
}

