import { PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/errorHandler';
import logger from '../../config/Logger';
const prisma = new PrismaClient();
export const chatService = {
    createChat: async (productId: number, buyerId: number) => {
        if (!productId || !buyerId) {
            throw new BadRequestError('Product ID and Buyer ID are required');
        }

        try {
            const existingChat = await prisma.chat.findFirst({
                where: { productId, buyerId },
            });

            if (existingChat) {
                return existingChat;
            }

            const newChat = await prisma.chat.create({
                data: {
                    productId,
                    buyerId,
                },
            });

            return newChat;
        } catch (error) {
            logger.error('Error creating chat:', error);
            throw error;
        }
    },

    addMessage: async (chatId: number, userId: number, messageText: string) => {
        if (!chatId || !userId || !messageText) {
            throw new BadRequestError(
                'Chat ID, User ID, and Message text are required',
            );
        }

        try {
            const chat = await prisma.chat.findUnique({ where: { chatId } });

            if (!chat) {
                throw new NotFoundError(`Chat with ID ${chatId} not found`);
            }

            const message = await prisma.message.create({
                data: {
                    chatId,
                    userId,
                    message: messageText,
                },
            });

            return message;
        } catch (error) {
            logger.error(`Error adding message to chat ID ${chatId}:`, error);
            throw error;
        }
    },

    getChatMessages: async (chatId: number) => {
        if (!chatId) {
            throw new BadRequestError('Chat ID is required');
        }

        try {
            const messages = await prisma.message.findMany({
                where: { chatId },
                orderBy: { createdDate: 'asc' },
            });

            if (!messages.length) {
                throw new NotFoundError(
                    `No messages found for chat ID ${chatId}`,
                );
            }

            return messages;
        } catch (error) {
            logger.error(
                `Error fetching messages for chat ID ${chatId}:`,
                error,
            );
            throw error;
        }
    },

    getUserChats: async (userId: number) => {
        if (!userId) {
            throw new BadRequestError('User ID is required');
        }

        try {
            const chats = await prisma.chat.findMany({
                where: {
                    OR: [{ buyerId: userId }],
                },
                include: {
                    product: true,
                    buyer: true,
                    message: true,
                },
            });

            if (!chats.length) {
                throw new NotFoundError(`No chats found for user ID ${userId}`);
            }

            return chats;
        } catch (error) {
            logger.error(`Error fetching chats for user ID ${userId}:`, error);
            throw error;
        }
    },

    getProductChats: async (productUuid: string) => {
        if (!productUuid) {
            throw new BadRequestError('Product UUID is required');
        }

        try {
            const chats = await prisma.chat.findMany({
                where: {
                    OR: [{ product: { id: productUuid } }],
                },
                include: {
                    product: true,
                    buyer: true,
                    message: true,
                },
            });

            if (!chats.length) {
                throw new NotFoundError(
                    `No chats found for product UUID ${productUuid}`,
                );
            }

            return chats;
        } catch (error) {
            logger.error(
                `Error fetching chats for product UUID ${productUuid}:`,
                error,
            );
            throw error;
        }
    },
};
