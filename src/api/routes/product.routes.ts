import { Router } from 'express';
import { productController } from '../controllers';

const router = Router();

// Create a new product
router.post('/', productController.createProduct);

// Update Product
router.put('/:id', productController.updateProduct);

// Delete Product
router.delete('/:id', productController.deleteProduct);
// router.get('/products/category/:categoryId', productController.getByCategoryId);

// Get all products for a user
router.get('/user', productController.getUserProducts);

// Add a product to the wishlist
router.get('/add-wishlist/:id', productController.addProductWishlist);

// Get all wishlist products for a user
router.get('/user-wishlists', productController.getUserWishlists);

// Product search suggestions
router.get('/suggestions', productController.searchSuggestions);

export default router;
