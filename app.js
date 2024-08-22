const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const {password} = require('./creds.json')

// console.log(password)

mongoose.connect(`mongodb+srv://vivekmdp13:${password}@mongotest.ziirv.mongodb.net/yelp-camp`)

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error : "));
db.once("open",()=>{
    console.log("Database connected!!");
})

const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
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

app.get('/campgrounds',async (req,res)=>{

    // res.send("Campground Index")
    const campgrounds = await Campground.find({})

    res.render('campgrounds/index.ejs',{campgrounds})
})
app.get('/campgrounds/new',(req,res)=>{

    res.render('campgrounds/new')
})
app.post('/campgrounds',async (req,res)=>{

    const campground = new Campground(req.body)
    console.log(campground)
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`)

})


app.get('/campgrounds/:id',async (req,res)=>{

    const campground = await Campground.findById(req.params.id)
    console.log(campground)
    res.render('campgrounds/show',{campground})
})
app.delete('/campgrounds/:id',async (req,res)=>{


    await Campground.findByIdAndDelete(req.params.id)

    res.redirect('/campgrounds')
    
})
app.get('/campgrounds/:id/edit',async (req,res)=>{

    const campground  = await Campground.findById(req.params.id)
    res.render('campgrounds/edit' , {campground})
})
app.put('/campgrounds/:id',async (req,res)=>{


    const campground  = await Campground.findByIdAndUpdate(req.params.id,req.body,{new:true})
    console.log(campground)
    res.redirect(`/campgrounds/${req.params.id}`)
})

app.listen(4000, (req,res)=>{

    console.log("Listening on port 4000!")
})

