const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

const {password} = require('../creds.json')

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

app.listen(3000, (req,res)=>{

    console.log("Listening on port 3000!")
})

