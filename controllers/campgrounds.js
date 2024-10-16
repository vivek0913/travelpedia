const Campground = require('../models/campground')

module.exports.index = async (req,res)=>{

    // res.send("Campground Index")
    const campgrounds = await Campground.find({})

    res.render('campgrounds/index.ejs',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{

    res.render('campgrounds/new')
}
module.exports.createCampground = async(req,res,next)=>{

    const campground = new Campground(req.body.campground)
    campground.images =  req.files.map(f => ({url : f.path, filename:f.filename}));
    campground.author = req.user.id;
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.showCampground = async(req,res)=>{

    const campground = await Campground.findById(req.params.id).populate({
        path: 'comments',
        populate :{
            path : 'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground})
}

module.exports.renderEditForm = async (req,res)=>{

    const campground  = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit' , {campground})
}

module.exports.updateCampground = async (req,res)=>{
    const campground  = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true})
    // console.log(campground)
    const imgs = req.files.map(f => ({url : f.path, filename:f.filename}));

    campground.images.push(...imgs);
    await campground.save();
    req.flash('success','Successfully updated campground!!');
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteCampground = async (req,res)=>{

    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
    
}