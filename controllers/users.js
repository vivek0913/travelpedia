const User = require('../models/user');


module.exports.renderRegister = (req,res)=>{

    res.render('users/register')
}

module.exports.register = async (req,res,next)=>{

    try{
     const {username,email,password} = req.body.user
     const user = new User({username,email});
     const reg_user = await User.register(user,password);
     req.login(reg_user,err=>{
         if(err){
             return next()
         }
 
         req.flash('succes',"Welcome to yelpcamp");
         res.redirect('/campgrounds');
     })
    
    }
    catch(e){
     req.flash('error',e.message);
     res.redirect('/register')
    }
 
 }

module.exports.renderLogin = (req,res)=>{

    res.render('users/login');

}

module.exports.login = (req,res)=>{
    
   
    req.flash('success',`welcome back! ${req.user.username}`)
    res.redirect('/campgrounds')


}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}