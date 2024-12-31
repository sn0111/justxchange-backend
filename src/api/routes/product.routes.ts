import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

router.post('/products', productController.createProduct);

// router.get('/products', productController.getAllProducts);

// Get Product by ID
router.get('/products/:id', productController.getProductById);

// Update Product
router.put('/products/:id', productController.updateProduct);

// Delete Product
router.delete('/products/:id', productController.deleteProduct);
// router.get('/products/category/:categoryId', productController.getByCategoryId);
router.get('/user/products', productController.getUserProducts);
router.get('/product/add-wishlist/:id', productController.addProductWishlist);
router.get('/product/user-wishlists', productController.getUserWishlists);

router.post('/filter/products', productController.getFilterProducts);
router.get('/product/suggestions', productController.searchSuggestions);

export default router;
