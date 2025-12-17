import { Op } from 'sequelize';
import { User } from '../types/User';
import { IRepository } from './IRepository';
import UserModel from '../models/User';

/**
 * UserRepository
 * Handles all data access operations for User entities using Sequelize
 */
export class UserRepository implements IRepository<User> {
  /**
   * Get all users from the database
   */
  public async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map(user => user.toJSON() as User);
  }

  /**
   * Find a user by their ID
   * @param id - User ID
   */
  public async findById(id: number | string): Promise<User | undefined> {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const user = await UserModel.findByPk(userId);
    return user ? (user.toJSON() as User) : undefined;
  }

  /**
   * Find a user by their email address
   * @param email - User email
   */
  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({
      where: {
        email: {
          [Op.iLike]: email, // Case-insensitive search
        },
      },
    });
    return user ? (user.toJSON() as User) : undefined;
  }

  /**
   * Search users by name or email
   * @param query - Search query
   */
  public async search(query: string): Promise<User[]> {
    const users = await UserModel.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    return users.map(user => user.toJSON() as User);
  }

  /**
   * Create a new user
   * @param data - User data
   */
  public async create(data: Partial<User>): Promise<User> {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    const newUser = await UserModel.create({
      name: data.name,
      email: data.email,
    });

    return newUser.toJSON() as User;
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - Updated user data
   */
  public async update(id: number | string, data: Partial<User>): Promise<User | undefined> {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const user = await UserModel.findByPk(userId);

    if (!user) {
      return undefined;
    }

    const updateData: Partial<User> = {};
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    await user.update(updateData);
    return user.toJSON() as User;
  }

  /**
   * Delete a user
   * @param id - User ID
   */
  public async delete(id: number | string): Promise<boolean> {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const deletedCount = await UserModel.destroy({
      where: { id: userId },
    });

    return deletedCount > 0;
  }

  /**
   * Check if a user exists
   * @param id - User ID
   */
  public async exists(id: number | string): Promise<boolean> {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const count = await UserModel.count({
      where: { id: userId },
    });
    return count > 0;
  }

  /**
   * Count total users
   */
  public async count(): Promise<number> {
    return await UserModel.count();
  }
}
