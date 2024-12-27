import Router from 'express';
import { userController } from '../controllers';
const router = Router();

router.get('/signup/:mobileNumber', userController.sendOtpToUser);
router.post('/verify-otp', userController.verifyOtp);
router.post('/save-user', userController.saveUser);
router.post('/login-user', userController.loginUser);
router.get('/user-profile', userController.userProfile);

export default router;
