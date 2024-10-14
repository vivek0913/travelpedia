const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const {password} = require('./creds.json')
const ExpressError = require('./utils/ExpressError')
const ejsMate   = require('ejs-mate')
const campgroundRoutes = require('./routes/campgrounds.js')
const commentRoutes = require('./routes/comments.js')
const userRoutes = require('./routes/users.js')
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
    console.log("Initialised dotenv config")
}
console.log(process.env.CLOUDINARY_CLOUD_NAME, process.env.CLOUDINARY_KEY, process.env.CLOUDINARY_SECRET )

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
const sessionConfig  = {
    secret:'thishouldbeabettersecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }

}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/',userRoutes);

app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req,res)=>{

    res.render('home')
})


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

