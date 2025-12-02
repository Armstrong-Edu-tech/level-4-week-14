const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');


// Add product (admin, single image)
router.post(
    '/',
    authenticate,
    authorize('admin'),
    upload.single('image'),
    productController.addProduct
);

// Update product (admin, single image optional)
router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    upload.single('image'),
    productController.updateProduct
);

// Soft delete product (admin)
router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    productController.softDeleteProduct
);

module.exports = router;
