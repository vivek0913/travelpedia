const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const {password} = require('./creds.json')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const ejsMate   = require('ejs-mate')
const Joi = require('joi')
const {campgroundSchema, commentSchema} = require('./schemas.js')
const Comment = require('./models/comments.js')
// console.log(password)

mongoose.connect(`mongodb+srv://vivekmdp13:${password}@mongotest.ziirv.mongodb.net/yelp-camp`)

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error : "));
db.once("open",()=>{
    console.log("Database connected!!");
})

const app = express()
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))

const validateCampground = (req,res,next)=>{

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
app.get('/',(req,res)=>{

    res.render('home')
})

app.get('/newcampground',async (req,res)=>{

    const campground = new Campground({
        title:"Masoori",
        price:1000,
        description:"In India",
        location:"India"
    })

    await campground.save()
    res.send("New campground made")
})

app.get('/campgrounds',catchAsync(async (req,res)=>{

    // res.send("Campground Index")
    const campgrounds = await Campground.find({})

    res.render('campgrounds/index.ejs',{campgrounds})
}))
app.get('/campgrounds/new',(req,res)=>{

    res.render('campgrounds/new')
})
app.post('/campgrounds',validateCampground, catchAsync(async(req,res,next)=>{

    const campground = new Campground(req.body.campground)
    console.log(campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)

}))


app.get('/campgrounds/:id',catchAsync(async(req,res)=>{

    const campground = await Campground.findById(req.params.id).populate('comments');
    // console.log(campground)
    res.render('campgrounds/show',{campground})
}))
app.delete('/campgrounds/:id',catchAsync(async (req,res)=>{


    await Campground.findByIdAndDelete(req.params.id)

    res.redirect('/campgrounds')
    
}))

app.post('/campgrounds/:id/comments',validateComment,catchAsync(async (req,res)=>{

    const campground = await Campground.findById(req.params.id) 
    const {body, rating} = req.body
    const comment = new Comment(req.body.comment)
    campground.comments.push(comment);
    await comment.save();
    await campground.save();
    // res.send(req.body)
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res)=>{

    const campground  = await Campground.findById(req.params.id)
    res.render('campgrounds/edit' , {campground})
}))
app.put('/campgrounds/:id',validateCampground,catchAsync(async (req,res)=>{


    const campground  = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true})
    console.log(campground)
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.delete('/campgrounds/:id/comments/:commentId',catchAsync(async(req,res)=>{

    const {id, commentId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {comments: commentId}})  // find comment with commentId from comments array of a particular campground and delete it using "pull"
    await Comment.findByIdAndDelete(req.params.commentId);
    res.redirect(`/campgrounds/${id}`)
    // res.send("Deleted comment")
}))
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found!!',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500, message = 'Something went wrong!!'} = err;
    if(! err.message) err.message = "Oh No, Something went wrong"
    res.status(statusCode).render('error', {err});
    
})
app.listen(4000, (req,res)=>{

    console.log("Listening on port 4000!")
})

