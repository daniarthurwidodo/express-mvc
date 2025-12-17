/**
 * Base Repository Interface
 * Defines the standard CRUD operations for all repositories
 * All methods return Promises for async database operations
 */
export interface IRepository<T> {
  /**
   * Find all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Find entity by ID
   * @param id - Entity identifier
   */
  findById(id: number | string): Promise<T | undefined>;

  /**
   * Create a new entity
   * @param data - Entity data
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param data - Updated entity data
   */
  update(id: number | string, data: Partial<T>): Promise<T | undefined>;

  /**
   * Delete an entity
   * @param id - Entity identifier
   */
  delete(id: number | string): Promise<boolean>;
}
