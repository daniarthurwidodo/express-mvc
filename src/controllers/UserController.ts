import { Request, Response } from 'express';

export class UserController {
  // GET /users
  public async getUsers(req: Request, res: Response): Promise<void> {
    try {
      // This would typically fetch from a database
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      res.status(200).json({
        success: true,
        data: users
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
      
      // This would typically fetch from a database
      const user = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
      
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

      // This would typically save to a database
      const newUser = { id: Date.now(), name, email };
      
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
}
