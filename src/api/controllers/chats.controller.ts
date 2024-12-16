import { NextFunction, Request, Response } from 'express';
import { chatService } from '../services';

export const chatController = {
    createChat: async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.body;
        try {
            const chat = await chatService.createChat(
                productId,
                Number(req.user?.userId),
            );
            res.status(200).json({ data: chat });
        } catch (error) {
            next(error);
        }
    },

    sendMessage: async (req: Request, res: Response, next: NextFunction) => {
        const { chatId, messageText } = req.body;
        try {
            const message = await chatService.addMessage(
                chatId,
                Number(req.user?.userId),
                messageText,
            );
            res.status(200).json(message);
        } catch (error) {
            next(error);
        }
    },

    getChatMessages: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const { chatId } = req.params;
        try {
            const messages = await chatService.getChatMessages(Number(chatId));
            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    },

    getUserChats: async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        try {
            const chats = await chatService.getUserChats(Number(userId));
            res.status(200).json({ data: chats });
        } catch (error) {
            next(error);
        }
    },

    getProductChats: async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        const productUuid = req.params.productUuid;
        try {
            const chats = await chatService.getProductChats(productUuid);
            res.status(200).json({ data: chats });
        } catch (error) {
            next(error);
        }
    },
};
