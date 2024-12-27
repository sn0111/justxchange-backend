import { userService } from '../services';
import { NextFunction, Request, Response } from 'express';
import { otpVerifySchema } from '../validators/otp.validator';
import {
    loginSchema,
    mobileNumberSchema,
    userSchema,
} from '../validators/user.validator';

export const userController = {
    sendOtpToUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await mobileNumberSchema.validateAsync(req.params);
            const messageId = await userService.sendOtpToUser(
                req.params.mobileNumber,
            );
            res.json({ data: { messageId } });
        } catch (err) {
            next(err);
        }
    },

    verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
        await otpVerifySchema.validateAsync(req.body);
        try {
            const verifyOtp = await userService.verifyOtp(req.body);
            res.json({ data: { verifyOtp } });
        } catch (err) {
            next(err);
        }
    },

    saveUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userSchema.validateAsync(req.body);
            const response = await userService.saveUser(req.body);
            res.json({ data: response });
        } catch (err) {
            next(err);
        }
    },

    loginUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await loginSchema.validateAsync(req.body);
            const response = await userService.loginUser(req.body);
            res.json({ data: response });
        } catch (err) {
            next(err);
        }
    },
    userProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const response = await userService.userProfile(Number(userId));
            res.json({ data: response });
        } catch (err) {
            next(err);
        }
    },
};
