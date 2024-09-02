const Joi  = require('joi');

// for server side form validations


/*
joi is a package for Node.js that provides a powerful tool for validating JavaScript objects.
It allows developers to create complex, customizable rules for ensuring that the data passed to
their applications is valid. This can be useful for a variety of reasons, 
such as ensuring that user input is in the correct format,
or preventing malicious data from being passed to your application.
*/

module.exports.campgroundSchema = Joi.object({
    campground : Joi.object({
        title : Joi.string().required(),
        price: Joi.number().required().min(0),
        image : Joi.string().required(),
        location : Joi.string().required(),
        description : Joi.string().required()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment : Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required()

    }).required()
})