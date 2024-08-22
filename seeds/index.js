const mongoose = require('mongoose')
const Campground = require('../models/campground')

const {password} = require('../../creds.json')

// console.log(password)

mongoose.connect(`mongodb+srv://vivekmdp13:${password}@mongotest.ziirv.mongodb.net/yelp-camp`)

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error : "));
db.once("open",()=>{
    console.log("Database connected!!");
})


const seedDB = async() =>{

    await Campground.deleteMany({});
    // const c = new Campground({title:'Purple field'})
    // await c.save();
    
}

seedDB();
