import { User, CreateUserDto, UpdateUserDto } from '../types/User';
import { UserRepository } from '../repositories/UserRepository';
import { Logger } from '../utils/logger';

export class UserService {
  private userRepository: UserRepository;
  private logger: Logger;

  constructor() {
    this.userRepository = new UserRepository();
    this.logger = new Logger({ module: 'UserService' });
  }

  public getAllUsers(): User[] {
    this.logger.debug('Fetching all users');
    const users = this.userRepository.findAll();
    this.logger.info(`Found ${users.length} users`);
    return users;
  }

  public getUserById(id: number): User | undefined {
    this.logger.debug(`Fetching user with ID: ${id}`);
    const user = this.userRepository.findById(id);
    
    if (user) {
      this.logger.info(`User found: ${user.email}`);
    } else {
      this.logger.warn(`User not found with ID: ${id}`);
    }
    
    return user;
  }

  public createUser(userData: CreateUserDto): User {
    this.logger.debug(`Creating user: ${userData.email}`);
    
    // Check if user already exists
    const existingUser = this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      this.logger.warn(`Attempted to create duplicate user: ${userData.email}`);
      throw new Error('User with this email already exists');
    }

    const newUser = this.userRepository.create(userData);
    this.logger.info(`User created successfully: ${newUser.email} (ID: ${newUser.id})`);
    return newUser;
  }

  public updateUser(id: number, userData: UpdateUserDto): User | undefined {
    this.logger.debug(`Updating user with ID: ${id}`);
    
    const updatedUser = this.userRepository.update(id, userData);
    
    if (updatedUser) {
      this.logger.info(`User updated successfully: ${updatedUser.email}`);
    } else {
      this.logger.warn(`Failed to update user with ID: ${id} - not found`);
    }
    
    return updatedUser;
  }

  public deleteUser(id: number): boolean {
    this.logger.debug(`Deleting user with ID: ${id}`);
    
    const deleted = this.userRepository.delete(id);
    
    if (deleted) {
      this.logger.info(`User deleted successfully (ID: ${id})`);
    } else {
      this.logger.warn(`Failed to delete user with ID: ${id} - not found`);
    }
    
    return deleted;
  }

  public getUserByEmail(email: string): User | undefined {
    this.logger.debug(`Fetching user by email: ${email}`);
    return this.userRepository.findByEmail(email);
  }

  public searchUsers(query: string): User[] {
    this.logger.debug(`Searching users with query: ${query}`);
    const users = this.userRepository.search(query);
    this.logger.info(`Found ${users.length} users matching query: ${query}`);
    return users;
  }
}
