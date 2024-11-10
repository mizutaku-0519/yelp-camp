const Joi = require("joi");

module.exports.campgroundScheme = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    imageUrl: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewScheme = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().max(5).min(1),
    body: Joi.required(),
  }).required(),
});
