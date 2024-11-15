import { NextFunction, Request, Response } from 'express';
import { categoryService } from '../services';
import { categorySchema } from '../validators/category.validator';
import { ICategory, ICategoryRes } from '../interfaces/category';
import { exceptionMsger } from '../utils/exceptionMsger';

export const categoryController = {
    createCategory: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[201] = {
            schema: {
                data: 
                    { $ref: "#/components/schemas/category" }   
            }
        } */

        try {
            await categorySchema.validate(req.body);
            const { categoryName } = req.body;

            const category = await categoryService.createCategory({
                categoryName,
            });
            const response = category;
            res.status(201).json({ data: response });
        } catch (err) {
            next(err);
        }
    },

    getAllCategories: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        /* #swagger.responses[200] = {
            schema: {
                data: [
                    { $ref: "#/components/schemas/category" }
                ]
            }
        } */
        try {
            const categories: ICategory[] =
                await categoryService.getAllCategories();
            const response = categories;
            res.status(200).json({ data: response });
        } catch (err) {
            next(err);
        }
    },

    getCategoryById: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        /* #swagger.responses[200] = {
            schema: {
                data: 
                    { $ref: "#/components/schemas/category" }
                
            }
        } */
        try {
            const category = await categoryService.getCategoryById(
                Number(req.params.id),
            );
            if (!category) {
                const response = 'Category not found';
                return res.status(404).json(exceptionMsger(response));
            }
            const response = category;
            res.json({ data: response });
        } catch (err) {
            next(err);
        }
    },

    updateCategory: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[200] = {
            schema: {
                message: 'Category updated successfully'
            }
        } */

        try {
            await categorySchema.validate(req.body);
            const { categoryName } = req.body;
            const category = await categoryService.updateCategory(
                Number(req.params.id),
                categoryName,
            );
            if (!category) {
                const response = 'Category not found';
                return res.status(404).json(exceptionMsger(response));
            }
            const response = 'Category updated successfully';
            res.json({ message: response });
        } catch (err) {
            next(err);
        }
    },

    deleteCategory: async (req: Request, res: Response, next: NextFunction) => {
        /* #swagger.responses[204] = {
            schema: {
                message: 'Category deleted successfully'
            }
        } */
        try {
            await categoryService.deleteCategory(Number(req.params.id));
            const response = 'Category deleted successfully';
            res.status(204).json({ message: response });
        } catch (err) {
            next(err);
        }
    },
};
