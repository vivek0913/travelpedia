const mongoose  = require('mongoose')
const Schema  = mongoose.Schema


const CampgroundSchema = new Schema({

    title:{

        type:String,
        required:true
    },
    price:{
        type:String,
    
    },
    description:{
        type:String,
        // required:true

    },
    location:{
        type:String,
        // required:true
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);
