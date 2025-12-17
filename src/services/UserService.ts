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

  public async getAllUsers(): Promise<User[]> {
    this.logger.debug('Fetching all users');
    const users = await this.userRepository.findAll();
    this.logger.info(`Found ${users.length} users`);
    return users;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    this.logger.debug(`Fetching user with ID: ${id}`);
    const user = await this.userRepository.findById(id);
    
    if (user) {
      this.logger.info(`User found: ${user.email}`);
    } else {
      this.logger.warn(`User not found with ID: ${id}`);
    }
    
    return user;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating user: ${userData.email}`);
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      this.logger.warn(`Attempted to create duplicate user: ${userData.email}`);
      throw new Error('User with this email already exists');
    }

    const newUser = await this.userRepository.create(userData);
    this.logger.info(`User created successfully: ${newUser.email} (ID: ${newUser.id})`);
    return newUser;
  }

  public async updateUser(id: number, userData: UpdateUserDto): Promise<User | undefined> {
    this.logger.debug(`Updating user with ID: ${id}`);
    
    const updatedUser = await this.userRepository.update(id, userData);
    
    if (updatedUser) {
      this.logger.info(`User updated successfully: ${updatedUser.email}`);
    } else {
      this.logger.warn(`Failed to update user with ID: ${id} - not found`);
    }
    
    return updatedUser;
  }

  public async deleteUser(id: number): Promise<boolean> {
    this.logger.debug(`Deleting user with ID: ${id}`);
    
    const deleted = await this.userRepository.delete(id);
    
    if (deleted) {
      this.logger.info(`User deleted successfully (ID: ${id})`);
    } else {
      this.logger.warn(`Failed to delete user with ID: ${id} - not found`);
    }
    
    return deleted;
  }

  public async getUserByEmail(email: string): Promise<User | undefined> {
    this.logger.debug(`Fetching user by email: ${email}`);
    return await this.userRepository.findByEmail(email);
  }

  public async searchUsers(query: string): Promise<User[]> {
    this.logger.debug(`Searching users with query: ${query}`);
    const users = await this.userRepository.search(query);
    this.logger.info(`Found ${users.length} users matching query: ${query}`);
    return users;
  }
}
