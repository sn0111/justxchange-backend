import { PrismaClient } from '@prisma/client';
import { smsService } from './sms.service';
import { IVerifyOtp } from '../interfaces';
import { IUser, IUserLoginIn, IUserProfile } from '../interfaces/user';
import { generateToken } from './auth.service';
import { comparePassword, hashPassword } from '../utils/auth';
import { generateOtpFormats } from '../utils/otpUtil';

const prisma = new PrismaClient();

export const userService = {
    sendOtpToUser: async (mobileNumber: string) => {
        try {
            let user = await prisma.user.findUnique({
                where: { mobileNumber },
            });
            const { otp, otpExpiry } = generateOtpFormats();
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        mobileNumber,
                        otp,
                        otpExpiry,
                    },
                });
            } else {
                await prisma.user.update({
                    where: { mobileNumber },
                    data: { otp, otpExpiry },
                });
            }

            const message = smsService.sendSms(mobileNumber, otp);
            console.log(`Message sent: ${message}`);
            return message;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    },

    verifyOtp: async (body: IVerifyOtp) => {
        const { mobileNumber, otp, lastLoginOtp } = body;

        try {
            const user = await prisma.user.findUnique({
                where: { mobileNumber },
            });

            if (!user) {
                throw new Error('Mobile number not found');
            }
            console.log('otp:', otp, 'user.otp:', user.otp);

            if (user.otp && user.otp !== otp) {
                throw new Error('Invalid OTP');
            }
            console.log(
                'user.lastLoginOtp:',
                user.lastLoginOtp,
                'lastLoginOtp:',
                lastLoginOtp,
            );
            if (lastLoginOtp && user.lastLoginOtp !== lastLoginOtp) {
                throw new Error('Invalid login OTP');
            }

            if (user.otpExpiry && user.otpExpiry < new Date()) {
                throw new Error('OTP has expired.');
            }

            await prisma.user.update({
                where: { mobileNumber },
                data: {
                    mobileVerified: true,
                    otp: null,
                    otpExpiry: null,
                    lastLoginOtp: null,
                },
            });
            if (user.lastLoginOtp) {
                const token = generateToken(user.userId);
                return {
                    token: token,
                    userId: user.userId,
                    isAdvancedAuthEnabled: user.is2FAEnabled,
                };
            }
            return 'OTP verified successfully.';
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    },

    saveUser: async (body: IUser) => {
        try {
            const user = await prisma.user.findUnique({
                where: { mobileNumber: body.mobileNumber },
            });

            if (!user) {
                throw new Error('Mobile number not found');
            }

            if (!user.mobileVerified) {
                throw new Error('Mobile number not verified');
            }
            const hashedPassword = await hashPassword(body.password);
            await prisma.user.update({
                where: { mobileNumber: body.mobileNumber },
                data: {
                    firstName: body.firstName,
                    lastName: body.lastName,
                    college: body.college,
                    email: body.email,
                    password: hashedPassword,
                },
            });

            const token = generateToken(user.userId);

            return { token: token, userId: user.userId };
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    },

    loginUser: async (body: IUserLoginIn) => {
        try {
            const user = await prisma.user.findUnique({
                where: { mobileNumber: body.mobileNumber },
            });
            const is2FAEnabled = user?.is2FAEnabled;

            if (!user) {
                throw new Error('Mobile number not found');
            }

            if (!user.mobileVerified) {
                throw new Error('Mobile number not verified');
            }

            // const hashedPassword = await hashPassword(body.password);
            const isVerified = await comparePassword(
                body.password,
                user.password || '',
            );

            if (!isVerified) {
                throw new Error('Invalid User password');
            }

            // Handle 2FA if enabled
            if (is2FAEnabled) {
                const { otp, otpExpiry } = generateOtpFormats();

                await prisma.user.update({
                    where: { mobileNumber: body.mobileNumber },
                    data: { lastLoginOtp: otp, otpExpiry, otp: null },
                });

                await smsService.sendSms(body.mobileNumber, otp);
                return {
                    message: 'OTP sent for Mobile Verification',
                    requires2FA: true,
                };
            }

            const token = generateToken(user.userId);

            return {
                token: token,
                userId: user.userId,
                isAdvancedAuthEnabled: is2FAEnabled,
            };
        } catch (error) {
            console.error('Error login user:', error);
            throw error;
        }
    },

    userProfile: async (userId: number) => {
        try {
            const user = await prisma.user.findUnique({
                where: { userId },
                include: { address: true },
            });

            return user;
        } catch (error) {
            console.error('Error in user profile:', error);
            throw error;
        }
    },

    saveProfile: async (userId: number, body: IUserProfile) => {
        try {
            const user = await prisma.user.findUnique({
                where: { userId },
                include: { address: true },
            });

            await prisma.user.update({
                where: { userId },
                data: {
                    firstName: body.firstName,
                    college: body.college,
                    is2FAEnabled: body.is2FAEnabled,
                    profileUrl: body.profileUrl
                },
            });
            const address = await prisma.address.findFirst({ where: { userId } });
            if (address) {
                await prisma.address.update({
                    where: { addressId: address.addressId },
                    data: {
                        address: body.address,
                        mobileNumber: body.contactNumber
                    }
                })
            } else {
                await prisma.address.create({
                    data: {
                        userId: userId,
                        address: body.address,
                        mobileNumber: body.contactNumber
                    }
                })
            }

            return "User profile details updated.";
        } catch (error) {
            console.error('Error in user profile:', error);
            throw error;
        }
    },
};
