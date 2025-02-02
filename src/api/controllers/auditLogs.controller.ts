import { NextFunction, Request, Response } from 'express';
import { auditLogService } from '../services';

export const auditLogsController = {
    getAuditLogs: async (req: Request, res: Response, next: NextFunction) => {

        try {
            const logs = await auditLogService.getAuditLogs(Number(req.query.pageNumber) || 1, Number(req.query.pageSize) || 10)
            return res.status(200).json(logs);
        } catch (error) {
            next(error);
        }
    },
};

