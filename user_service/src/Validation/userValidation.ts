import Joi from "joi";

export const signupValidation = Joi.object({
   name:Joi.string().required().min(3),
   email:Joi.string().required().lowercase().email(),
   password:Joi.string().required().min(6)
})

export const loginValidation =Joi.object({
    email:Joi.string().required().lowercase().email(),
    password:Joi.string().required().min(6)
})