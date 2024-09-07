const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware.js')



router.get('/',catchAsync(async (req,res)=>{

    // res.send("Campground Index")
    const campgrounds = await Campground.find({})

    res.render('campgrounds/index.ejs',{campgrounds})
}))


router.get('/new',isLoggedIn,(req,res)=>{

    res.render('campgrounds/new')
})

router.post('/',isLoggedIn,validateCampground, catchAsync(async(req,res,next)=>{

    const campground = new Campground(req.body.campground)
    campground.author = req.user.id;
    console.log(campground)
    await campground.save();
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))


router.get('/:id',catchAsync(async(req,res)=>{

    const campground = await Campground.findById(req.params.id).populate({
        path: 'comments',
        populate :{
            path : 'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}))

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async (req,res)=>{


    await Campground.findByIdAndDelete(req.params.id)

    res.redirect('/campgrounds')
    
}))





router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async (req,res)=>{

    const campground  = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit' , {campground})
}))

router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async (req,res)=>{


    const campground  = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true})
    console.log(campground)
    req.flash('success','Successfully updated campground!!');
    res.redirect(`/campgrounds/${req.params.id}`)
}))




module.exports=router