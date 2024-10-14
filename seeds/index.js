const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
// const {password} = require('../creds.json')
const password = process.env.MONGO_PASSWORD

console.log("Mongo password = ",password)

mongoose.connect(`mongodb+srv://vivekmdp13:${password}@mongotest.ziirv.mongodb.net/yelp-camp`)

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error : "));
db.once("open",()=>{
    console.log("Database connected!!");
})


const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async() =>{

    await Campground.deleteMany({});
    
    for(let i=0;i<50;i++){
        const random1000  = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*1000)
        const image_id = Math.floor(Math.random()*500)

        const camp =   new Campground({
            author:'66db166a08dad3a664237700',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // image : `https://picsum.photos/${image_id}/${image_id+100}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dmmow2xq2/image/upload/v1725814947/YelpCamp/njvwjx7pbikeoisddihn.jpg',
                  filename: 'YelpCamp/njvwjx7pbikeoisddihn',
                },
                {
                  url: 'https://res.cloudinary.com/dmmow2xq2/image/upload/v1725814949/YelpCamp/cgmstoklaewgvpvool7a.jpg',
                  filename: 'YelpCamp/cgmstoklaewgvpvool7a',
                }
              ], 
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea unde sed maiores? Quam corporis amet culpa tempora nulla, soluta maxime dolorem ipsa repellat provident rerum, minus atque officia a nostrum.',
            price:price


        })

        await camp.save();

    }
    
}

seedDB().then(()=>{
    mongoose.connection.close();
});
