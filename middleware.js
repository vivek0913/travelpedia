const {campgroundSchema, commentSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Comment = require('./models/comments.js')

module.exports.isLoggedIn = (req,res,next)=>{
    console.log("User is : ",req.user)
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }

    next();
}

module.exports.validateCampground = (req,res,next)=>{

    console.log("Inside middleware")
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        console.log("Error message is",msg)
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

module.exports.isAuthor = async(req,res,next) =>{
    const {id} = req.params
    const campground = await Campground.findById(id);

    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

module.exports.isCommentAuthor = async(req,res,next) =>{
    const {commentId} = req.params
    const comment = await Comment.findById(commentId);

    if(!comment.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that');
        return res.redirect(`/campgrounds/${req.params.id}`);
    }
    next();
}

module.exports.validateComment = (req,res,next)=>{
    const {error} = commentSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}