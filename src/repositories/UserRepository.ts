import { User } from '../types/User';
import { IRepository } from './IRepository';

/**
 * UserRepository
 * Handles all data access operations for User entities
 * In a real application, this would interact with a database
 */
export class UserRepository implements IRepository<User> {
  private users: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      createdAt: new Date('2025-01-01'), 
      updatedAt: new Date('2025-01-01') 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      createdAt: new Date('2025-01-02'), 
      updatedAt: new Date('2025-01-02') 
    }
  ];

  /**
   * Get all users from the data store
   */
  public findAll(): User[] {
    return this.users;
  }

  /**
   * Find a user by their ID
   * @param id - User ID
   */
  public findById(id: number | string): User | undefined {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    return this.users.find(user => user.id === userId);
  }

  /**
   * Find a user by their email address
   * @param email - User email
   */
  public findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Search users by name or email
   * @param query - Search query
   */
  public search(query: string): User[] {
    const lowercaseQuery = query.toLowerCase();
    return this.users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) || 
      user.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Create a new user
   * @param data - User data
   */
  public create(data: Partial<User>): User {
    if (!data.name || !data.email) {
      throw new Error('Name and email are required');
    }

    const newUser: User = {
      id: Date.now(), // In production, this would be handled by the database
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - Updated user data
   */
  public update(id: number | string, data: Partial<User>): User | undefined {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const userIndex = this.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return undefined;
    }

    const existingUser = this.users[userIndex];
    if (!existingUser) {
      return undefined;
    }

    const updatedUser: User = {
      id: existingUser.id,
      name: data.name ?? existingUser.name,
      email: data.email ?? existingUser.email,
      createdAt: existingUser.createdAt ?? new Date(),
      updatedAt: new Date()
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete a user
   * @param id - User ID
   */
  public delete(id: number | string): boolean {
    const userId = typeof id === 'string' ? parseInt(id) : id;
    const userIndex = this.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  /**
   * Check if a user exists
   * @param id - User ID
   */
  public exists(id: number | string): boolean {
    return this.findById(id) !== undefined;
  }

  /**
   * Count total users
   */
  public count(): number {
    return this.users.length;
  }
}
