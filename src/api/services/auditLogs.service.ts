import { PrismaClient } from '@prisma/client';
import logger from '../../config/Logger';

const prisma = new PrismaClient();

export const auditLogService = {


    getAuditLogs: async (pageNumber: number, pageSize: number) => {
        try {
            const offset = (pageNumber - 1) * pageSize;
            const auditLogs = await prisma.auditLog.findMany({
                orderBy: {
                    timestamp: "desc",
                },
                skip: offset,
                take: pageSize,
            });

            const totalRecords = await prisma.auditLog.count();

            return {
                totalRecords,
                totalPages: Math.ceil(totalRecords / pageSize),
                currentPage: pageNumber,
                logs: auditLogs,
            };
        } catch (error) {
            logger.error('Error fetching categories:', error);
            throw error;
        }
    }
};
