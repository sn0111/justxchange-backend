import { Router } from 'express';
import { chatController } from '../controllers';

const router = Router();

// Create a new chat
router.post('/', chatController.createChat);

// Send a message in a chat
router.post('/message', chatController.sendMessage);

// Get all messages for a specific chat
router.get('/messages/:chatId', chatController.getChatMessages);

// Get all chats for a user
router.get('/', chatController.getUserChats);

// Get all chats related to a specific product
router.get('/product/:productUuid', chatController.getProductChats);

export default router;
