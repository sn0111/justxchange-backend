import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();
// commonly needed routes for both user and admin

//product
router.post('/products/filter', productController.getFilterProducts);
router.get('/products/:id', productController.getProductById);

export default router;
