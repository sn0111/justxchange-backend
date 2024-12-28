// src/controllers/productController.ts
import { NextFunction, Request, Response } from 'express';
import { productService } from '../services';
import { IProduct } from '../interfaces/product';
import productSchema from '../validators/product.validator';
import { exceptionMsger } from '../utils/exceptionMsger';

export const productController = {
    // Create a new product
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[200] = {
        schema: {
            message: 'Product created successfully',
            data: [
                { $ref: "#/components/schemas/product" }
            ]
        }
    } */
        try {
            // Validate request body
            await productSchema.validateAsync(req.body);

            const productData = {
                ...req.body,
                amount: parseFloat(req.body.amount),
                categoryId: parseFloat(req.body.categoryId),
            };
            const product: IProduct = await productService.create(productData);

            // Respond with success
            res.status(200).json({
                message: 'Product created successfully',
                data: product,
            });
        } catch (err: any) {
            next(err);
        }
    },

    // Get all products
    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[200] = {
            schema: {
                data: [
                    { $ref: "#/components/schemas/product" }
                ]
            }
        } */
        try {
            const products = await productService.getAll(
                Number(req.user?.userId),
            );
            res.json({ data: products });
        } catch (err) {
            next(err);
        }
    },

    // Get a product by ID
    getProductById: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[200] = {
            schema: {
                data: 
                    { $ref: "#/components/schemas/product" }
                
            }
        } */
        try {
            const product: IProduct | null = await productService.getById(
                req.params.id,
            );
            if (!product)
                return res
                    .status(404)
                    .json(exceptionMsger('Product not found'));
            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },

    // Update a product by ID
    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[200] = {
            schema: {
                message: 'Updated product successfully',
                data: 
                    { $ref: "#/components/schemas/product" }
                
            }
        } */
        try {
            const product: IProduct | null = await productService.update(
                Number(req.params.id),
                req.body,
            );
            if (!product)
                return res
                    .status(404)
                    .json(exceptionMsger('Product Id not found'));
            res.json({
                message: 'Updated product successfully',
                data: product,
            });
        } catch (err) {
            next(err);
        }
    },

    // Delete a product by ID
    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await productService.delete(Number(req.params.id));
            res.status(204).json({ message: 'Product deleted successfully' });
        } catch (err) {
            next(err);
        }
    },

    getByCategoryId: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const products: IProduct[] | [] =
                await productService.getByCategoryId(
                    Number(req.params.categoryId),
                );

            res.json({ data: products });
        } catch (err) {
            next(err);
        }
    },
    // Get a product by ID
    getUserProducts: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const product: IProduct[] = await productService.getUserProducts(
                Number(req.user?.userId),
            );

            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },
    addProductWishlist: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const result = await productService.addProductWishlist(
                Number(req.user?.userId),
                req.params.id,
            );


            res.json({ data: result });
        } catch (err) {
            next(err);
        }
    },
    getUserWishlists: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const product: IProduct[] = await productService.getUserWishlists(
                Number(req.user?.userId),
            );

            res.json({ data: product });
        } catch (err) {
            next(err);
        }
    },
};
