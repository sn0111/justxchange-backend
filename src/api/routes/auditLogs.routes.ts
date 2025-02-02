import { Router } from 'express';
import { auditLogsController } from '../controllers';

const router = Router();
router.get('/audit/logs', auditLogsController.getAuditLogs);


export default router;
