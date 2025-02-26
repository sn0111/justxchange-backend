import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import routes from './api/routes';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/Logger';
import { verifyToken } from './api/services/auth.service';
import { exceptionMsger } from './api/utils/exceptionMsger';
import { errorHandler } from './api/utils/errorHandler';
import { chatService, productService } from './api/services';
import { PrismaClient } from '@prisma/client';

// const swaggerDocument = require('./api/docs/swagger-output.json');
const swaggerUi = require('swagger-ui-express');
const prisma = new PrismaClient();

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                [key: string]: any;
                role: string;
            };
        }
    }
}

dotenv.config();

const app = express();

// Middleware for JSON parsing
app.use(express.json());
// CORS options
const corsOptions = {
    origin: '*', // Allow requests from your Next.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200, // For legacy browser support
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms'),
);
app.use((req, res, next) => {
    const publicRoutes = [
        '/login-user',
        '/signup(/.*)?$',
        '/verify-otp',
        '/save-user',
        '/forgot-password',
        '^/api-docs(/.*)?$',
        '^/socket.io(/.*)?$',
    ];

    if (publicRoutes.some((pattern) => new RegExp(pattern).test(req.path))) {
        return next();
    }

    const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res
            .status(403)
            .json(exceptionMsger('Access denied. No token provided.'));
    }

    try {
        const tokenDetails = verifyToken(token);
        req.user = tokenDetails;
        next();
    } catch (error) {
        res.status(401).json(exceptionMsger('Invalid token.'));
    }
});
// Middleware to log response body
app.use(async (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(
            `Response for ${req.user?.userId} ${req.method} ${req.originalUrl}:`,
            body,
        );
        return originalSend.apply(res, [body]);
    };

    const action = `${req.method} ${req.originalUrl}`;
    const ipAddress: string = req.ip || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const platform = req.headers['sec-ch-ua-platform'];
    const mobile = req.headers['sec-ch-ua-mobile'];
    console.log(mobile);
    await prisma.auditLog.create({
        data: {
            userId: Number(req.user?.userId) || 0,
            action,
            platform:
                typeof platform === 'object' && Array.isArray(platform)
                    ? platform[0]
                    : platform,
            isMobile:
                typeof mobile === 'object' && Array.isArray(mobile)
                    ? mobile[0]
                    : mobile,
            ipAddress,
            userAgent,
        },
    });
    next();
});
// Routes
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(routes);
app.use(errorHandler);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error occurred in ${req.method} ${req.url}: ${err.message}`);
    res.status(500).send('Internal Server Error');
});
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// const notifications:INotifications[]=[];

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', (chatUuid: string) => {
        socket.join(chatUuid);
        console.log(`User ${chatUuid} joined room ${chatUuid}`);
    });

    socket.on('sendMessage', async (data) => {
        const { chatId, userId, message } = data;
        console.log(data);
        // Save message to DB via service
        const savedMessage = await chatService.addMessage(
            chatId,
            userId,
            message,
        );

        // Emit message to receiver
        io.to(chatId).emit('receiveMessage', savedMessage);
    });

    socket.on('subscribe', async (userId: string) => {
        console.log(`User subscribed: ${userId}`);
        socket.join(userId);

        // Send unread notifications to the user
        const userNotifications = await productService.getNotifications();
        const filterNotifications = userNotifications.filter(
            (n) => n.userId === Number(userId) && !n.isRead,
        );
        socket.emit('unread-notifications', filterNotifications);
    });

    // Mark notifications as read
    socket.on('mark-as-read', async (notificationIds: string[]) => {
        try {
            const notifications = await productService.getNotifications();
            let userId = 1;
            notificationIds.forEach((id) => {
                const notification = notifications.find((n) => n.id === id);
                if (notification) {
                    notification.isRead = true;
                    userId = notification.userId;
                }
                productService.udpateNotification(id);
            });
            const filterNotifications = notifications.filter(
                (n) => n.userId === Number(userId) && !n.isRead,
            );
            socket.emit('unread-notifications', filterNotifications);
        } catch (error) {
            logger.error(`Error update notifications`, error);
        }
    });

    socket.on('typing', ({ chatId, userId }) => {
        socket.to(chatId).emit('userTyping', { chatId, userId });
    });

    socket.on('stopTyping', ({ chatId, userId }) => {
        socket.to(chatId).emit('userStoppedTyping', { chatId, userId });
    });

    socket.on('setOnline', ({ userId }) => {
        // onlineUsers[userId] = true;
        io.emit('userOnlineStatus', { userId, status: 'online' });
    });

    socket.on('setOffline', ({ userId }) => {
        // onlineUsers[userId] = true;
        io.emit('userOnlineStatus', { userId, status: 'offline' });
        console.log(`User ${userId} went offline.`);
    });

    socket.on('user-disconnect', async (data) => {
        console.log(data);
        const chat = await prisma.chat.findUnique({
            where: {
                id: data.chat,
            },
        });
        if (chat) {
            if (data.isOwner) {
                chat.buyerLastSeen = new Date();
            } else {
                chat.userLastSeen = new Date();
            }
            await prisma.chat.update({
                where: { id: data.chat },
                data: {
                    buyerLastSeen: data.isOwner
                        ? new Date()
                        : chat.buyerLastSeen,
                    userLastSeen: !data.isOwner
                        ? new Date()
                        : chat.userLastSeen,
                },
            });
        }
        console.log(`User ${data.userId} is disconnecting`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
export { io };
// Initialize models and then start the server
const PORT = process.env.PORT || 8090;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
