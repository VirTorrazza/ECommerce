export const privateRoutes = (req, res,next )=>{
    if(req.user) return res.redirect('/profile')
        next();
}

export const publicRoutes =(req,res,next)=>{
    if(!req.user) return res.redirect('/login');
    next();
}

export const handlePolicies = policies => (req, res, next) => {
    if (policies.includes('PUBLIC')) return next();

    const user = req.user || null;
    if( !policies.includes(user.role.toUpperCase()) ) 
    {
        return res.status(403).send('<h1>Error: Need Auth</h1>');
    }

    return next();
}