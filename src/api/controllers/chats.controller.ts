import { NextFunction, Request, Response } from 'express';
import { chatService } from '../services';

export const chatController = {
    createChat: async (req: Request, res: Response, next: NextFunction) => {
        const { productId, buyerId } = req.body;
        try {
            const chat = await chatService.createChat(productId, buyerId);
            res.status(201).json(chat);
        } catch (error) {
            next(error);
        }
    },

    sendMessage: async (req: Request, res: Response, next: NextFunction) => {
        const { chatId, userId, messageText } = req.body;
        try {
            const message = await chatService.addMessage(
                chatId,
                userId,
                messageText,
            );
            res.status(201).json(message);
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
        const { userId } = req.params;
        try {
            const chats = await chatService.getUserChats(Number(userId));
            res.status(200).json(chats);
        } catch (error) {
            next(error);
        }
    },
};
