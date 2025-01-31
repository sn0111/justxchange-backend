import Joi from 'joi';

export const otpVerifySchema = Joi.object({
    signUpValue: Joi.string().trim().required().messages({
        'string.empty': 'Signup Value is required',
        'any.required': 'Signup Value is required',
    }),
    otp: Joi.string().min(6).max(6).required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required',
    }),
    emailOrSms: Joi.string().trim().required().messages({
        'string.empty': 'SignUp type is required',
        'any.required': 'SignUp type is required',
    }),
});
