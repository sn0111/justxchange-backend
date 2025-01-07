import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY as string;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '1h';

export const generateToken = (userId: number, role: string) => {
    return jwt.sign({ userId, role }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY) as {
        userId: string;
        role: string;
        [key: string]: any;
    };
};
