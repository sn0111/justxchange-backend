import twilio from 'twilio';
import logger from '../../config/Logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const smsService = {
    /**
     * Sends an SMS with the given OTP.
     * @param to - The recipient's phone number (e.g., +1234567890).
     * @param otp - The OTP to include in the message.
     * @returns The message SID if the SMS was sent successfully.
     */
    sendSms: async (to: string, otp: string): Promise<string> => {
        // Validate input
        if (!to || !otp) {
            throw new Error('Recipient phone number and OTP are required');
        }

        if (!process.env.TWILIO_PHONE_NUMBER) {
            throw new Error(
                'TWILIO_PHONE_NUMBER environment variable is not set',
            );
        }

        try {
            logger.info('Sending SMS', { to });

            const message = await client.messages.create({
                body: `Welcome to JustXchange! Your OTP code for completing the signup process is: ${otp}. Thank You.`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to,
            });

            logger.info('SMS sent successfully', {
                to,
                messageSid: message.sid,
            });
            return message.sid;
        } catch (error: any) {
            logger.error('Error sending SMS', { error: error.message, to });
            throw new Error('Failed to send SMS. Please try again later.');
        }
    },
};
