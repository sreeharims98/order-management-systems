import { Request, Response } from 'express';
import { CreateProductRequest, UpdateProductRequest } from '../types';
import productService from '../services/productService';

/**
 * Create a new product
 * POST /products
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, price, stock } = req.body as CreateProductRequest;

    // Validate input
    if (!name || !price || !stock) {
      res.status(400).json({
        status: 'error',
        message: 'Name, price and stock are required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const product = await productService.createProduct({ name, price, stock });

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Get all products (paginated)
 * GET /products?page=1&limit=10
 */
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    const { products, total } = await productService.getAllProducts(page, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Get product by ID
 * GET /products/:id
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const product = await productService.getProductById(productId);

    if (!product) {
      res.status(404).json({
        status: 'error',
        message: 'Product not found',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Product retrieved successfully',
      data: product,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Update product
 * PUT /products/:id
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { name, price, stock } = req.body as UpdateProductRequest;

    // Check if at least one field is provided
    if (!name && !price && !stock) {
      res.status(400).json({
        status: 'error',
        message: 'At least one field (name, price or stock) must be provided for update',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const product = await productService.updateProduct(productId, { name, price, stock });

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: product,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Delete product
 * DELETE /product/:id
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid product ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    await productService.deleteProduct(productId);

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = message.includes('not found') ? 404 : 400;
    res.status(statusCode).json({
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Product Controller - Exported as functional module
 */
const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productController;
