import Joi from 'joi';

const productSchema = Joi.object({
    productId: Joi.number().optional(), // Optional as it may not be provided during creation
    productName: Joi.string().trim().required().messages({
        'string.empty': 'Product name is required',
        'any.required': 'Product name is required',
    }),
    description: Joi.string().optional(),
    amount: Joi.number().greater(0).required().messages({
        'number.base': 'Amount must be a number',
        'number.greater': 'Amount must be greater than zero',
        'any.required': 'Amount is required',
    }),
    categoryId: Joi.number().integer().positive().required().messages({
        'number.base': 'Category ID must be a number',
        'number.integer': 'Category ID must be an integer',
        'number.positive': 'Category ID must be a positive number',
        'any.required': 'Category ID is required',
    }),
    // userId: Joi.number().integer().positive().required().messages({
    //     'number.base': 'User ID must be a number',
    //     'number.integer': 'User ID must be an integer',
    //     'number.positive': 'User ID must be a positive number',
    //     'any.required': 'User ID is required',
    // }),
    images: Joi.array().items(Joi.string().uri()).optional(), // Optional array of image URLs
    condition: Joi.string().valid('New', 'Used').required().messages({
        'any.only': 'Condition must be either "new" or "used"',
        'any.required': 'Condition is required',
    }),
    brand: Joi.string().optional().default("None").allow(''),
    size: Joi.string().optional().default("None").allow(''),
    color: Joi.string().optional().default("None").allow('')

});

// Export the schema
export default productSchema;
