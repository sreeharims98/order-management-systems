/**
 * Entity Types - Database Models
 */

// User entity
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
}

// Product entity
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  created_at: Date;
}

// Order entity
export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  created_at: Date;
}

// OrderItem entity (join table - links orders to products)
export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

// Payment entity
export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  payment_method: string;
  status: PaymentStatus;
  created_at: Date;
}

/**
 * Enums
 */

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Request/Response Types
 */

// User requests
export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

// Product requests
export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
}

// Order requests
export interface CreateOrderRequest {
  user_id: number;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  product_id: number;
  quantity: number;
}

// Payment requests
export interface CreatePaymentRequest {
  order_id: number;
  amount: number;
  payment_method: string;
}

/**
 * API Response Types
 */

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
}

/**
 * Extended types for API responses
 */

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
  user: User;
}

export interface OrderItemWithProduct extends OrderItem {
  product: Product;
}

export interface UserWithOrders extends User {
  orders: Order[];
  orderCount: number;
}
