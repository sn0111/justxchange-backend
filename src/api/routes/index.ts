import { Router } from 'express';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import imageRoutes from './image.routes';
import chatRoutes from './chats.routes';
import favouriteRoutes from './favourites.routes';
import userRoutes from './user.routes';
import { attachSwaggerResponses } from '../../middleware/response';
import { authorizeTo } from '../../middleware/authorize';
import commonRoutes from './common.routes';

const router = Router();
router.use(attachSwaggerResponses);
// Public routes (user login/signup...etc routes)

// Protected routes (Require authentication)
// router.use(authMiddleware); // Apply auth middleware to all routes that follow this

//Routes wihtout specific "Role" authorization
router.use(categoryRoutes /* #swagger.tags = ['Category']  */);
router.use(imageRoutes /* #swagger.tags = ['Image'] */);
router.use(favouriteRoutes /* #swagger.tags = ['Favourites'] */);
router.use(userRoutes /* #swagger.tags = ['Users'] */);

// Routes with specific "Role" authorization
router.use(
    '/products',
    authorizeTo('user'),
    productRoutes,
    /* #swagger.tags = ['Product'] */
);
router.use(
    '/chats',
    authorizeTo('user'),
    chatRoutes,
    /* #swagger.tags = ['Chats'] */
);

// Common routes for both user and admin
router.use(commonRoutes);
export default router;
