 export const showRegisterPage = (req, res) => {
    res.render('sessions/register');
};

export const showLoginPage= (req,res)=>{
    res.render('sessions/login');
}

export const showProfilePage= (req,res)=>{
    res.render('sessions/profile', req.user );
}
