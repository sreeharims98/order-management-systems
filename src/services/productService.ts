import sql from '../config/database';
import { CreateProductRequest, Product, UpdateProductRequest } from '../types';

/**
 * Create a new product
 * @param prouductData - Product creation data (name, email)
 * @returns Promise<Product> - Created product object
 * @throws Error if email is already taken or database error occurs
 */
export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
  try {
    // Check if product already exists
    const existingProduct = await sql`
      SELECT id FROM products WHERE name = ${productData.name}
    `;

    console.log(existingProduct, 'existingProduct');

    if (existingProduct && existingProduct.length > 0) {
      throw new Error(`Name ${productData.name} is already in use`);
    }

    // // Insert new product
    const result = await sql`
      INSERT INTO products (name, price, stock)
      VALUES (${productData.name}, ${productData.price}, ${productData.stock})
      RETURNING id, name, price, stock, created_at
    `;

    if (!result || result.length === 0) {
      throw new Error('Failed to create product');
    }

    return result[0] as Product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Get all products with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise<{products: Product[], total: number}> - Products and total count
 */
export const getAllProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<{ products: Product[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as count FROM products
    `;

    const total = countResult && countResult[0] ? Number((countResult[0] as any).count) : 0;

    // Get paginated products
    const products = await sql`
      SELECT id, name, price, stock, created_at
      FROM products
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return {
      products: (products || []) as Product[],
      total,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Get product by ID
 * @param id - Product ID
 * @returns Promise<Product | null> - Product object or null if not found
 */
export const getProductById = async (id: number): Promise<Product | null> => {
  try {
    const result = await sql`
      SELECT id, name, price, stock, created_at
      FROM products
      WHERE id = ${id}
    `;

    return result && result.length > 0 ? (result[0] as Product) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Update product information
 * @param id - Product ID
 * @param updateData - Data to update (name and/or email)
 * @returns Promise<Product> - Updated product object
 * @throws Error if product not found or name is already taken by another product
 */
export const updateProduct = async (
  id: number,
  updateData: UpdateProductRequest
): Promise<Product> => {
  try {
    // Check if product exists
    const product = await getProductById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // If name is being updated, check for duplicates (excluding current product)
    if (updateData.name && updateData.name !== product.name) {
      const existingProduct = await sql`
        SELECT id FROM products WHERE name = ${updateData.name} AND id != ${id}
      `;

      if (existingProduct && existingProduct.length > 0) {
        throw new Error(`Name ${updateData.name} is already in use`);
      }
    }

    // Execute update
    const result = await sql`
      UPDATE products
      SET
        name = ${updateData.name ?? product.name},
        price = ${updateData.price ?? product.price},
        stock = ${updateData.stock ?? product.stock}
      WHERE id = ${id}
      RETURNING id, name, price, stock, created_at
    `;

    if (!result || result.length === 0) {
      throw new Error('Failed to update product');
    }

    return result[0] as Product;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Delete product by ID
 * @param id - Product ID
 * @returns Promise<boolean> - True if product was deleted
 * @throws Error if product not found
 */
export const deleteProduct = async (id: number): Promise<boolean> => {
  try {
    // Check if product exists
    const product = await getProductById(id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Delete product (ON DELETE CASCADE will handle orders, order_items, payments)
    await sql`
      DELETE FROM products
      WHERE id = ${id}
    `;

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Product Service - Exported as functional module
 */
const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};

export default productService;
