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
        return res.status(403).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error: Need Auth</title>
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
                  <h1 class="error-title">Error: Need Auth</h1>
                  <p class="text-muted">You are not authorized to access this resource.</p>
                  <a href="/login" class="btn btn-primary">Login</a>
                </div>
              </div>
            </body>
            </html>
          `);
    }

    return next();
}