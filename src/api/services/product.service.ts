import { PrismaClient } from '@prisma/client';
import { IProduct } from '../interfaces';
import logger from '../../config/Logger';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';

const prisma = new PrismaClient();

export const productService = {
    create: async (productData: IProduct) => {
        if (!productData) {
            throw new BadRequestError('Product data is required');
        }

        try {
            const newProduct = await prisma.product.create({
                data: productData,
            });
            return newProduct;
        } catch (error) {
            logger.error('Error creating product:', error);
            throw error;
        }
    },

    getAll: async () => {
        try {
            const products: [] =
                await prisma.$queryRaw`SELECT * FROM "products" ORDER BY RANDOM() LIMIT 10`;
            if (!products.length) {
                throw new NotFoundError('No products found');
            }
            return products;
        } catch (error) {
            logger.error('Error fetching all products:', error);
            throw error;
        }
    },

    getById: async (id: number) => {
        if (!id) {
            throw new BadRequestError('Product ID is required');
        }

        try {
            const product = await prisma.product.findUnique({
                where: { productId: id },
            });

            if (!product) {
                throw new NotFoundError(`Product not found with ID ${id}`);
            }

            return product;
        } catch (error) {
            logger.error(`Error fetching product by ID ${id}:`, error);
            throw error;
        }
    },

    update: async (id: number, productData: IProduct) => {
        if (!id || !productData) {
            throw new BadRequestError('Product ID and data are required');
        }

        try {
            const updatedProduct = await prisma.product.update({
                where: { productId: id },
                data: productData,
            });

            return updatedProduct;
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError(`Product not found with ID ${id}`);
            }
            logger.error(`Error updating product with ID ${id}:`, error);
            throw error;
        }
    },

    delete: async (id: number) => {
        if (!id) {
            throw new BadRequestError('Product ID is required');
        }

        try {
            const deletedProduct = await prisma.product.delete({
                where: { productId: id },
            });

            return { message: 'Product deleted successfully', deletedProduct };
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError(`Product not found with ID ${id}`);
            }
            logger.error(`Error deleting product with ID ${id}:`, error);
            throw error;
        }
    },

    getByCategoryId: async (categoryId: number) => {
        if (!categoryId) {
            throw new BadRequestError('Category ID is required');
        }

        try {
            const products = await prisma.product.findMany({
                where: { categoryId },
            });

            if (!products.length) {
                throw new NotFoundError(
                    `No products found for category ID ${categoryId}`,
                );
            }

            return products;
        } catch (error: any) {
            logger.error(
                `Error fetching products for category ID ${categoryId}:`,
                error,
            );
            throw error;
        }
    },
};
