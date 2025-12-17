/**
 * Base Repository Interface
 * Defines the standard CRUD operations for all repositories
 */
export interface IRepository<T> {
  /**
   * Find all entities
   */
  findAll(): Promise<T[]> | T[];

  /**
   * Find entity by ID
   * @param id - Entity identifier
   */
  findById(id: number | string): Promise<T | undefined> | T | undefined;

  /**
   * Create a new entity
   * @param data - Entity data
   */
  create(data: Partial<T>): Promise<T> | T;

  /**
   * Update an existing entity
   * @param id - Entity identifier
   * @param data - Updated entity data
   */
  update(id: number | string, data: Partial<T>): Promise<T | undefined> | T | undefined;

  /**
   * Delete an entity
   * @param id - Entity identifier
   */
  delete(id: number | string): Promise<boolean> | boolean;
}
