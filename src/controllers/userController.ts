import { Request, Response } from 'express';
import userService from '../services/userService';
import { CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types/index';

/**
 * Create a new user
 * POST /users
 */
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body as CreateUserRequest;

    // Validate input
    if (!name || !email) {
      res.status(400).json({
        status: 'error',
        message: 'Name and email are required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await userService.createUser({ name, email });

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: user,
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
 * Get user by ID
 * GET /users/:id
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'User retrieved successfully',
      data: user,
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
 * Get all users (paginated)
 * GET /users?page=1&limit=10
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));

    const { users, total } = await userService.getAllUsers(page, limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      message: 'Users retrieved successfully',
      data: users,
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
 * Update user
 * PUT /users/:id
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const { name, email } = req.body as UpdateUserRequest;

    // Check if at least one field is provided
    if (!name && !email) {
      res.status(400).json({
        status: 'error',
        message: 'At least one field (name or email) must be provided for update',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const user = await userService.updateUser(userId, { name, email });

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user,
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
 * Delete user
 * DELETE /users/:id
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid user ID',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    await userService.deleteUser(userId);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
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
 * User Controller - Exported as functional module
 */
const userController = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

export default userController;
