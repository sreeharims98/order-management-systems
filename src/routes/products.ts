// Product routes: POST /products, GET /products, PATCH /products/:id
// TODO: Implement product endpoints

import express, { Router } from 'express';
import productController from '../controllers/productController';

/**
 * Create product router
 */
const createProductRouter = (): Router => {
  const router = express.Router();

  /**
   * POST /products - Create a new product
   */
  router.post('/', productController.createProduct);

  /**
   * GET /products - Get all products (paginated)
   */
  router.get('/', productController.getAllProducts);

  /**
   * GET /products/:id - Get product by ID
   */
  router.get('/:id', productController.getProductById);

  /**
   * PUT /products/:id - Update product
   */
  router.put('/:id', productController.updateProduct);

  /**
   * DELETE /products/:id - Delete product
   */
  router.delete('/:id', productController.deleteProduct);

  return router;
};

export default createProductRouter();
