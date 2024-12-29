export const generateOtpFormats = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    return { otp, otpExpiry };
};
