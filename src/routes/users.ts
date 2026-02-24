import express, { Router } from 'express';
import userController from '../controllers/userController';

/**
 * Create user router
 */
const createUserRouter = (): Router => {
  const router = express.Router();

  /**
   * POST /users - Create a new user
   */
  router.post('/', userController.createUser);

  /**
   * GET /users - Get all users (paginated)
   */
  router.get('/', userController.getAllUsers);

  /**
   * GET /users/:id - Get user by ID
   */
  router.get('/:id', userController.getUserById);

  /**
   * PUT /users/:id - Update user
   */
  router.put('/:id', userController.updateUser);

  /**
   * DELETE /users/:id - Delete user
   */
  router.delete('/:id', userController.deleteUser);

  return router;
};

export default createUserRouter();
