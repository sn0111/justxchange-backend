import Router from 'express';
import { chatController } from '../controllers';
const router = Router();

router.post('/chat', chatController.createChat);
router.post('/message', chatController.sendMessage);
router.get('/messages/:chatId', chatController.getChatMessages);
router.get('/chats', chatController.getUserChats);
router.get('/product/chats/:productUuid', chatController.getProductChats);

export default router;
