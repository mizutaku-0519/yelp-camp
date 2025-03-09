const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    // imageUrl: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
}).required();

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().max(5).min(1).required(),
    text: Joi.string().required(),
  }).required(),
}).required();
