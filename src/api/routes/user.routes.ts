import Router from 'express';
import { userController } from '../controllers';
const router = Router();

router.post('/signup', userController.sendOtpToUser);
router.post('/verify-otp', userController.verifyOtp);
router.post('/save-user', userController.saveUser);
router.post('/login-user', userController.loginUser);
router.get('/user-profile', userController.userProfile);
router.post('/save-profile', userController.saveProfile);
router.put('/forgot-password', userController.forgotPassword);

export default router;
