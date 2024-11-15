import { PrismaClient } from '@prisma/client';
import { ICategory } from '../interfaces';
import logger from '../../config/Logger';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';

const prisma = new PrismaClient();

export const categoryService = {
    createCategory: async (categoryData: ICategory) => {
        if (!categoryData || !categoryData.categoryName) {
            throw new BadRequestError('Category name is required');
        }

        try {
            const category = await prisma.category.create({
                data: categoryData,
            });
            return category;
        } catch (error) {
            logger.error('Error creating category:', error);
            throw error;
        }
    },

    getAllCategories: async () => {
        try {
            logger.info('Fetching all categories');
            return await prisma.category.findMany({
                orderBy: {
                    categoryName: 'asc',
                },
            });
        } catch (error) {
            logger.error('Error fetching categories:', error);
            throw error;
        }
    },

    getCategoryById: async (id: number) => {
        if (!id) {
            throw new BadRequestError('Category ID is required');
        }

        try {
            const category = await prisma.category.findUnique({
                where: { categoryId: id },
            });

            if (!category) {
                throw new NotFoundError(`Category with ID ${id} not found`);
            }

            return category;
        } catch (error) {
            logger.error(`Error fetching category with ID ${id}:`, error);
            throw error;
        }
    },

    updateCategory: async (id: number, categoryData: any) => {
        if (!id) {
            throw new BadRequestError('Category ID is required');
        }

        if (!categoryData || !categoryData.categoryName) {
            throw new BadRequestError('Category name is required');
        }

        try {
            const category = await prisma.category.update({
                where: { categoryId: id },
                data: categoryData,
            });
            return category;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError(`Category with ID ${id} not found`);
            }
            logger.error(`Error updating category with ID ${id}:`, error);
            throw error;
        }
    },

    deleteCategory: async (id: number) => {
        if (!id) {
            throw new BadRequestError('Category ID is required');
        }

        try {
            await prisma.category.delete({
                where: { categoryId: id },
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError(`Category with ID ${id} not found`);
            }
            logger.error(`Error deleting category with ID ${id}:`, error);
            throw error;
        }
    },
};
