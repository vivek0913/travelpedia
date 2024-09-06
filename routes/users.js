const express = require('express')
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const { route } = require('./campgrounds');
const passport = require('passport')





router.get('/register',(req,res)=>{

    res.render('users/register')
})

router.post('/register',catchAsync(async (req,res,next)=>{

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

}));

router.get('/login',(req,res)=>{

    res.render('users/login');

})

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    
   
    req.flash('success','welcome back!')
    res.redirect('/campgrounds')


})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

module.exports=router