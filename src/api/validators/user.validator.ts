import Joi from 'joi';

export const userSchema = Joi.object({
    userId: Joi.number().optional(), // Optional as it may not be provided during creation
    firstName: Joi.string().trim().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required',
    }),
    description: Joi.string().optional(),
    email: Joi.string().email().trim().required().messages({
        'string.email': 'Email must be valid',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    mobileNumber: Joi.string().trim().required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    emailVerified: Joi.boolean().default(false), // Default to false if not provided
    mobileVerified: Joi.boolean().default(false), // Default to false if not provided
    college: Joi.string().trim().required().messages({
        'string.empty': 'College is required',
        'any.required': 'College is required',
    }),
    emailOrSms: Joi.string().trim().required().messages({
        'string.empty': 'SignUp type is required',
        'any.required': 'SignUp type is required',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().trim().required().messages({
        'string.email': 'Email must be valid',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    mobileNumber: Joi.string().trim().required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    emailOrSms: Joi.string().trim().required().messages({
        'string.empty': 'SignUp type is required',
        'any.required': 'SignUp type is required',
    }),
});

export const mobileNumberSchema = Joi.object({
    signUpValue: Joi.string().trim().required().messages({
        'string.empty': 'Signup Value is required',
        'any.required': 'Signup Value is required',
    }),
    emailOrSms: Joi.string().trim().required().messages({
        'string.empty': 'SignUp type is required',
        'any.required': 'SignUp type is required',
    }),
});

export const userProfileSchema = Joi.object({
    firstName: Joi.string().trim().required().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required',
    }),
    email: Joi.string().email().trim().required().messages({
        'string.email': 'Email must be valid',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    mobileNumber: Joi.string().trim().required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required',
    }),
    college: Joi.string().trim().required().messages({
        'string.empty': 'College is required',
        'any.required': 'College is required',
    }),
    contactNumber: Joi.string().trim().required().messages({
        'string.empty': 'Contact number is required',
        'any.required': 'Contact number is required',
    }),
    address: Joi.string().trim().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required',
    }),
    is2FAEnabled: Joi.boolean().default(false),
    profileUrl: Joi.string().trim().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required',
    }),
    isContactView: Joi.boolean().default(false),
});
