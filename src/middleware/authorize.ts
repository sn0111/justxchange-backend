import { Request, Response, NextFunction } from 'express';

export const authorizeTo = (allowedRoles: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role as string;

        // Skip Role authorization for API documentation
        if (req.path.startsWith('/api-docs')) {
            return next();
        }

        // Normalize allowedRoles to an array
        const roles = Array.isArray(allowedRoles)
            ? allowedRoles
            : [allowedRoles];

        if (!roles.includes(userRole)) {
            return res
                .status(403)
                .json({ exceptionMessage: 'Access denied for this role' });
        }

        next();
    };
};
