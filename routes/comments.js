const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync')
const Comment = require('../models/comments.js')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')

const { commentSchema} = require('../schemas.js')

const validateComment = (req,res,next)=>{
    const {error} = commentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

router.post('/',validateComment,catchAsync(async (req,res)=>{

    const campground = await Campground.findById(req.params.id) 
    const {body, rating} = req.body
    const comment = new Comment(req.body.comment)
    campground.comments.push(comment);
    await comment.save();
    await campground.save();
    // res.send(req.body)
    req.flash('success','Added a new comment')
    res.redirect(`/campgrounds/${campground._id}`)
    
}))


router.delete('/:commentId',catchAsync(async(req,res)=>{

    const {id, commentId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {comments: commentId}})  // find comment with commentId from comments array of a particular campground and delete it using "pull"
    await Comment.findByIdAndDelete(req.params.commentId);
    req.flash('success','Succesfully deleted a comment')
    res.redirect(`/campgrounds/${id}`)
    // res.send("Deleted comment")
}))


module.exports = router;