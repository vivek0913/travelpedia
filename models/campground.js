const mongoose  = require('mongoose')
const Schema  = mongoose.Schema
const Comment = require('./comments')


const CampgroundSchema = new Schema({

    title:{

        type:String,
        // required:true
    },
    images : [{

        url: String,
        filename : String

    }],
    description:{
        type:String,
        // required:true

    },
    location:{
        type:String,
        // required:true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    ,
    comments :[
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Comment.deleteMany({
            _id : { $in : doc.comments}
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);
