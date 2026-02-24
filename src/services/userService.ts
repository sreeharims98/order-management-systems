import sql from '../config/database';
import { User, CreateUserRequest, UpdateUserRequest } from '../types/index';

/**
 * Create a new user
 * @param userData - User creation data (name, email)
 * @returns Promise<User> - Created user object
 * @throws Error if email is already taken or database error occurs
 */
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  try {
    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${userData.email}
    `;

    if (existingUser && existingUser.length > 0) {
      throw new Error(`Email ${userData.email} is already in use`);
    }

    // Insert new user
    const result = await sql`
      INSERT INTO users (name, email)
      VALUES (${userData.name}, ${userData.email})
      RETURNING id, name, email, created_at
    `;

    if (!result || result.length === 0) {
      throw new Error('Failed to create user');
    }

    return result[0] as User;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise<User | null> - User object or null if not found
 */
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const result = await sql`
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ${id}
    `;

    return result && result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Get all users with pagination
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 10)
 * @returns Promise<{users: User[], total: number}> - Users and total count
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: User[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await sql`
      SELECT COUNT(*) as count FROM users
    `;

    const total = countResult && countResult[0] ? Number((countResult[0] as any).count) : 0;

    // Get paginated users
    const users = await sql`
      SELECT id, name, email, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return {
      users: (users || []) as User[],
      total,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Get user by email
 * @param email - User email
 * @returns Promise<User | null> - User object or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await sql`
      SELECT id, name, email, created_at
      FROM users
      WHERE email = ${email}
    `;

    return result && result.length > 0 ? (result[0] as User) : null;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Update user information
 * @param id - User ID
 * @param updateData - Data to update (name and/or email)
 * @returns Promise<User> - Updated user object
 * @throws Error if user not found or email is already taken by another user
 */
export const updateUser = async (id: number, updateData: UpdateUserRequest): Promise<User> => {
  try {
    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // If email is being updated, check for duplicates (excluding current user)
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await sql`
        SELECT id FROM users WHERE email = ${updateData.email} AND id != ${id}
      `;

      if (existingUser && existingUser.length > 0) {
        throw new Error(`Email ${updateData.email} is already in use`);
      }
    }

    // Execute update
    const result = await sql`
      UPDATE users
      SET
        name = ${updateData.name ?? user.name},
        email = ${updateData.email ?? user.email}
      WHERE id = ${id}
      RETURNING id, name, email, created_at
    `;

    if (!result || result.length === 0) {
      throw new Error('Failed to update user');
    }

    return result[0] as User;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Promise<boolean> - True if user was deleted
 * @throws Error if user not found
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Delete user (ON DELETE CASCADE will handle orders, order_items, payments)
    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    throw error;
  }
};

/**
 * Check if user exists by ID
 * @param id - User ID
 * @returns Promise<boolean> - True if user exists
 */
export const userExists = async (id: number): Promise<boolean> => {
  try {
    const result = await sql`
      SELECT 1 FROM users WHERE id = ${id}
    `;

    return result && result.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to check user existence: ${error.message}`);
    }
    throw error;
  }
};

/**
 * User Service - Exported as functional module
 */
const userService = {
  createUser,
  getUserById,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
  userExists,
};

export default userService;
