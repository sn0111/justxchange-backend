import { Prisma, PrismaClient } from '@prisma/client';
import { IProduct } from '../interfaces';
import logger from '../../config/Logger';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';
import { INotifications, IProductFilters } from '../interfaces/product';
import { io } from '../../server';

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

            const users = await prisma.user.findMany();
            users.forEach(async (user) => {
                const notification = await prisma.notifications.create({
                    data: {
                        userId: user.userId,
                        message: `A new product "${newProduct.productName}" was added!`,
                        productId: newProduct.id,
                    },
                });
                // Send the notification to online users
                io.to(user.userId.toString()).emit(
                    'notification',
                    notification,
                );
            });

            return newProduct;
        } catch (error) {
            logger.error('Error creating product:', error);
            throw error;
        }
    },

    getAll: async (userId: number) => {
        try {
            const products: IProduct[] =
                await prisma.$queryRaw`SELECT * FROM "products" WHERE "user_id" != ${userId} ORDER BY RANDOM() LIMIT 10`;

            // if (!products.length) {
            //     throw new NotFoundError('No products found');
            // }
            const formattedProducts: IProduct[] = products.map(
                (product: any) => ({
                    id: product.id,
                    productId: product.product_id, // Ensure keys match the database mappings
                    productName: product.product_name,
                    description: product.description,
                    amount: product.amount,
                    categoryId: product.category_id,
                    userId: product.user_id,
                    images: product.images, // Prisma will parse JSON array fields correctly
                    condition: product.condition,
                    brand: product.brand,
                    color: product.color,
                    size: product.size,
                }),
            );

            return formattedProducts;
        } catch (error) {
            logger.error('Error fetching all products:', error);
            throw error;
        }
    },

    getById: async (id: string) => {
        if (!id) {
            throw new BadRequestError('Product ID is required');
        }

        try {
            const product = await prisma.product.findUnique({
                where: { id: id },
                include: {
                    user: {
                        include: {
                            address: true,
                        },
                    },
                },
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

    update: async (id: string, productData: IProduct) => {
        if (!id || !productData) {
            throw new BadRequestError('Product ID and data are required');
        }

        try {
            const updatedProduct = await prisma.product.update({
                where: { id: id },
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

    getByCategoryId: async (categoryId: number, userId: number) => {
        if (!categoryId) {
            throw new BadRequestError('Category ID is required');
        }

        try {
            const products = await prisma.product.findMany({
                where: {
                    categoryId,
                    userId: {
                        not: {
                            equals: userId,
                        },
                    },
                    user: {
                        email: {
                            contains: '@rguktn.ac.in',
                            mode: 'insensitive',
                        },
                        OR: [
                            {
                                email: {
                                    contains: '@rgukts.ac.in',
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                },
            });

            return products;
        } catch (error: any) {
            logger.error(
                `Error fetching products for category ID ${categoryId}:`,
                error,
            );
            throw error;
        }
    },

    getUserProducts: async (userId: number) => {
        try {
            const products = await prisma.product.findMany({
                where: { userId: userId },
            });

            return products;
        } catch (error) {
            logger.error(`Error fetching product by userId ${userId}:`, error);
            throw error;
        }
    },

    addProductWishlist: async (userId: number, uuid: string) => {
        try {
            const product = await prisma.product.findUnique({
                where: { id: uuid },
            });

            if (product) {
                await prisma.userProductWishList.create({
                    data: {
                        productId: product?.productId,
                        userId: userId,
                    },
                });
                return 'Added to your wishlist.';
            }
            throw new NotFoundError(`Product not found with ID ${uuid}`);
        } catch (error) {
            logger.error(`Error fetching product by userId ${userId}:`, error);
            throw error;
        }
    },

    getUserWishlists: async (userId: number) => {
        try {
            const wishlists = await prisma.userProductWishList.findMany();
            const productIds = wishlists.map((p) => p.productId);

            const products = await prisma.product.findMany({
                where: {
                    productId: { in: productIds },
                },
            });

            return products;
        } catch (error) {
            logger.error(`Error fetching product by userId ${userId}:`, error);
            throw error;
        }
    },

    getFilterProducts: async (body: IProductFilters, userId: number) => {
        try {
            let products: IProduct[] = [];
            let totalCount: number = 0;
            const pageNumber = body.page;
            const pageSize = body.size;
            if (body.isFilter) {
                const where: Prisma.ProductWhereInput = {
                    AND: [],
                };

                if (body.searchQuery) {
                    (where.AND as Prisma.ProductWhereInput[]).push({
                        OR: [
                            {
                                productName: {
                                    contains: body.searchQuery as string,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                description: {
                                    contains: body.searchQuery as string,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                category: {
                                    categoryName: {
                                        contains: body.searchQuery,
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                user: {
                                    email: {
                                        contains: '@rguktn.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                user: {
                                    email: {
                                        contains: '@rgukts.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    });
                }

                if (body.productUuid) {
                    (where.AND as Prisma.ProductWhereInput[]).push({
                        id: body.productUuid,
                        OR: [
                            {
                                user: {
                                    email: {
                                        contains: '@rguktn.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                user: {
                                    email: {
                                        contains: '@rgukts.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    });
                }

                if (body.categoryUuid) {
                    (where.AND as Prisma.ProductWhereInput[]).push({
                        category: {
                            id: body.categoryUuid,
                        },
                        OR: [
                            {
                                user: {
                                    email: {
                                        contains: '@rguktn.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                user: {
                                    email: {
                                        contains: '@rgukts.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    });
                }

                if (body.condition) {
                    (where.AND as Prisma.ProductWhereInput[]).push({
                        condition: body.condition,
                    });
                }

                // Fetch products with pagination
                products = await prisma.product.findMany({
                    where,
                    skip: (pageNumber - 1) * pageSize,
                    take: pageSize,
                    include: {
                        category: false, // Include category details if needed
                    },
                });

                // Fetch total count for pagination metadata
                totalCount = await prisma.product.count({ where });
            } else {
                products = await prisma.$queryRaw`
                    SELECT * 
                    FROM "products" p
                    JOIN "users" u ON p."user_id" = u."user_id"
                    WHERE p."user_id" != ${userId}
                    AND (u."email" ILIKE '%@rguktn.ac.in%' OR u."email" ILIKE '%@rgukts.ac.in%')
                    ORDER BY RANDOM() 
                    LIMIT 10;
                `;

                totalCount = await prisma.product.count({
                    where: {
                        userId: { not: userId },
                        OR: [
                            {
                                user: {
                                    email: {
                                        contains: '@rguktn.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                            {
                                user: {
                                    email: {
                                        contains: '@rgukts.ac.in',
                                        mode: 'insensitive',
                                    },
                                },
                            },
                        ],
                    },
                });
            }

            const formattedProducts: IProduct[] = products.map(
                (product: any) => ({
                    id: product.id,
                    productId: body.isFilter
                        ? product.productId
                        : product.product_id,
                    productName: body.isFilter
                        ? product.productName
                        : product.product_name,
                    description: product.description,
                    amount: product.amount,
                    categoryId: body.isFilter
                        ? product.categoryId
                        : product.category_id,
                    userId: body.isFilter ? product.userId : product.user_id,
                    images: product.images,
                    condition: product.condition,
                    brand: product.brand,
                    color: product.color,
                    size: product.size,
                }),
            );

            return {
                data: formattedProducts,
                meta: {
                    totalCount,
                    totalPages: Math.ceil(totalCount / pageSize),
                    currentPage: pageNumber,
                },
            };
        } catch (error) {
            logger.error('Error fetching all products:', error);
            throw error;
        }
    },

    searchSuggestions: async (searchQuery: string) => {
        try {
            const suggestions = await prisma.product.findMany({
                where: {
                    OR: [
                        {
                            productName: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: searchQuery,
                                mode: 'insensitive',
                            },
                        },
                        {
                            category: {
                                categoryName: {
                                    contains: searchQuery,
                                    mode: 'insensitive',
                                },
                            },
                        },
                    ],
                },
                select: {
                    productName: true,
                    id: true,
                },
                take: 10,
            });

            return suggestions;
        } catch (error: any) {
            logger.error(`Error fetching suggestions ${searchQuery}:`, error);
            throw error;
        }
    },

    getNotifications: async () => {
        try {
            const notifications: INotifications[] =
                await prisma.notifications.findMany();
            return notifications;
        } catch (error) {
            logger.error(`Error fetching notifications`, error);
            throw error;
        }
    },
};
