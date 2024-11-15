import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './api/routes';
import cors from 'cors';
import morgan from 'morgan';
import logger from './config/Logger';
import { verifyToken } from './api/services/auth.service';
import { exceptionMsger } from './api/utils/exceptionMsger';
import { errorHandler } from './api/utils/errorHandler';

const swaggerDocument = require('./api/docs/swagger-output.json');
const swaggerUi = require('swagger-ui-express');

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
        '^/api-docs(/.*)?$',
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
        verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json(exceptionMsger('Invalid token.'));
    }
});
// Middleware to log response body
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response for ${req.method} ${req.originalUrl}:`, body);
        return originalSend.apply(res, [body]);
    };
    next();
});
// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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

// Initialize models and then start the server
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
