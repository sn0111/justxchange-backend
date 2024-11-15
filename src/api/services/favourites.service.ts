import { PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';
import logger from '../../config/Logger';
const prisma = new PrismaClient();

export const favouriteService = {
    addCategoryFavorite: async (userId: number, categoryId: number) => {
        if (!userId || !categoryId) {
            throw new BadRequestError('User ID and Category ID are required');
        }

        try {
            const existingFavorite = await prisma.categoryFovourite.findFirst({
                where: { userId, categoryId },
            });

            if (existingFavorite) {
                return existingFavorite;
            }

            const newFavorite = await prisma.categoryFovourite.create({
                data: {
                    userId,
                    categoryId,
                },
            });

            return newFavorite;
        } catch (error) {
            logger.error('Error adding category to favorites:', error);
            throw error;
        }
    },

    getUserCategoryFavorites: async (userId: number) => {
        if (!userId) {
            throw new BadRequestError('User ID is required');
        }

        try {
            const favorites = await prisma.categoryFovourite.findMany({
                where: { userId },
                include: { category: true },
            });

            if (!favorites.length) {
                throw new NotFoundError(
                    `No category favorites found for user ID ${userId}`,
                );
            }

            return favorites;
        } catch (error) {
            logger.error(
                `Error fetching category favorites for user ID ${userId}:`,
                error,
            );
            throw error;
        }
    },

    removeCategoryFavorite: async (userId: number, categoryId: number) => {
        if (!userId || !categoryId) {
            throw new BadRequestError('User ID and Category ID are required');
        }

        try {
            const deleted = await prisma.categoryFovourite.deleteMany({
                where: { userId, categoryId },
            });

            if (!deleted.count) {
                throw new NotFoundError(
                    `Favorite not found for user ID ${userId} and category ID ${categoryId}`,
                );
            }

            return { message: 'Favorite removed successfully' };
        } catch (error) {
            logger.error(
                `Error removing category favorite for user ID ${userId} and category ID ${categoryId}:`,
                error,
            );
            throw error;
        }
    },

    addProductFavorite: async (userId: number, productId: number) => {
        if (!userId || !productId) {
            throw new BadRequestError('User ID and Product ID are required');
        }

        try {
            const existingFavorite = await prisma.productFovourite.findFirst({
                where: { userId, productId },
            });

            if (existingFavorite) {
                return existingFavorite;
            }

            const newFavorite = await prisma.productFovourite.create({
                data: {
                    userId,
                    productId,
                },
            });

            return newFavorite;
        } catch (error) {
            logger.error('Error adding product to favorites:', error);
            throw error;
        }
    },

    getUserProductFavorites: async (userId: number) => {
        if (!userId) {
            throw new BadRequestError('User ID is required');
        }

        try {
            const favorites = await prisma.productFovourite.findMany({
                where: { userId },
                include: { product: true },
            });

            if (!favorites.length) {
                throw new NotFoundError(
                    `No product favorites found for user ID ${userId}`,
                );
            }

            return favorites;
        } catch (error) {
            logger.error(
                `Error fetching product favorites for user ID ${userId}:`,
                error,
            );
            throw error;
        }
    },

    removeProductFavorite: async (userId: number, productId: number) => {
        if (!userId || !productId) {
            throw new BadRequestError('User ID and Product ID are required');
        }

        try {
            const deleted = await prisma.productFovourite.deleteMany({
                where: { userId, productId },
            });

            if (!deleted.count) {
                throw new NotFoundError(
                    `Favorite not found for user ID ${userId} and product ID ${productId}`,
                );
            }

            return { message: 'Favorite removed successfully' };
        } catch (error) {
            logger.error(
                `Error removing product favorite for user ID ${userId} and product ID ${productId}:`,
                error,
            );
            throw error;
        }
    },
};
