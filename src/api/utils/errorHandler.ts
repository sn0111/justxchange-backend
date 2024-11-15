import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { exceptionMsger } from './exceptionMsger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err); // Delegate to default Express error handler if headers are already sent
    }

    if (err instanceof ValidationError) {
        const message = err.details
            ? err.details[0].message
            : 'Validation error';
        return res.status(400).json(exceptionMsger(message));
    }

    res.status(500).json(exceptionMsger(err.message || 'Server error'));
};

export class BadRequestError extends Error {
    status = 400;
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
    }
}

export class NotFoundError extends Error {
    status = 404;
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
    }
}
