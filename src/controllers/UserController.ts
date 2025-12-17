import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { HttpResponse } from '../utils/httpResponse';
import { Logger } from '../utils/logger';

export class UserController {
  private userService: UserService;
  private logger: Logger;

  constructor() {
    this.userService = new UserService();
    this.logger = new Logger({ module: 'UserController' });
  }

  // GET /users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      
      let users;
      if (search && typeof search === 'string') {
        this.logger.info(`Searching users with query: ${search}`);
        users = this.userService.searchUsers(search);
      } else {
        this.logger.info('Fetching all users');
        users = this.userService.getAllUsers();
      }
      
      HttpResponse.success(res, { users, count: users.length });
    } catch (error) {
      this.logger.error('Error fetching users', error as Error);
      HttpResponse.internalError(res, 'Failed to fetch users');
    }
  }

  // GET /users/:id
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        HttpResponse.badRequest(res, 'User ID is required');
        return;
      }
      
      const userId = parseInt(id);
      if (isNaN(userId)) {
        HttpResponse.badRequest(res, 'Invalid user ID format');
        return;
      }

      this.logger.info(`Fetching user with ID: ${userId}`);
      const user = this.userService.getUserById(userId);
      
      if (!user) {
        HttpResponse.notFound(res, `User with ID ${userId} not found`);
        return;
      }

      HttpResponse.success(res, user);
    } catch (error) {
      this.logger.error(`Error fetching user by ID`, error as Error);
      HttpResponse.internalError(res, 'Failed to fetch user');
    }
  }

  // POST /users
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        HttpResponse.badRequest(res, 'Name and email are required');
        return;
      }

      this.logger.info(`Creating new user: ${email}`);
      
      // Check if user with email already exists
      const existingUser = this.userService.getUserByEmail(email);
      if (existingUser) {
        this.logger.warn(`Attempted to create duplicate user: ${email}`);
        HttpResponse.conflict(res, 'User with this email already exists');
        return;
      }

      const newUser = this.userService.createUser({ name, email });
      HttpResponse.created(res, newUser, 'User created successfully');
    } catch (error) {
      this.logger.error('Error creating user', error as Error);
      HttpResponse.internalError(res, 'Failed to create user');
    }
  }

  // PUT /users/:id
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      if (!id) {
        HttpResponse.badRequest(res, 'User ID is required');
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        HttpResponse.badRequest(res, 'Invalid user ID format');
        return;
      }

      this.logger.info(`Updating user with ID: ${userId}`);
      const updatedUser = this.userService.updateUser(userId, { name, email });
      
      if (!updatedUser) {
        HttpResponse.notFound(res, `User with ID ${userId} not found`);
        return;
      }

      HttpResponse.success(res, updatedUser, 'User updated successfully');
    } catch (error) {
      this.logger.error(`Error updating user`, error as Error);
      HttpResponse.internalError(res, 'Failed to update user');
    }
  }

  // DELETE /users/:id
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        HttpResponse.badRequest(res, 'User ID is required');
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        HttpResponse.badRequest(res, 'Invalid user ID format');
        return;
      }

      this.logger.info(`Deleting user with ID: ${userId}`);
      const deleted = this.userService.deleteUser(userId);
      
      if (!deleted) {
        HttpResponse.notFound(res, `User with ID ${userId} not found`);
        return;
      }

      HttpResponse.success(res, null, 'User deleted successfully');
    } catch (error) {
      this.logger.error(`Error deleting user`, error as Error);
      HttpResponse.internalError(res, 'Failed to delete user');
    }
  }
}
