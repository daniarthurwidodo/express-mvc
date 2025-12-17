import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      
      let users;
      if (search && typeof search === 'string') {
        users = this.userService.searchUsers(search);
      } else {
        users = this.userService.getAllUsers();
      }
      
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // GET /users/:id
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }
      
      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }

      const user = this.userService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // POST /users
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;
      
      if (!name || !email) {
        res.status(400).json({
          success: false,
          message: 'Name and email are required'
        });
        return;
      }

      // Check if user with email already exists
      const existingUser = this.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
        return;
      }

      const newUser = this.userService.createUser({ name, email });
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // PUT /users/:id
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }

      const updatedUser = this.userService.updateUser(userId, { name, email });
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  // DELETE /users/:id
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid user ID format'
        });
        return;
      }

      const deleted = this.userService.deleteUser(userId);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}
