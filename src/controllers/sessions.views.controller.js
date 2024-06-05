 import UserDTO from "../dto/users.dto.js";
 
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
    } else {     // Handles the case where req.user is undefined or missing
        res.status(404).send('User not found');
    }
}

