# Sequelize Setup Guide

This project uses Sequelize ORM for database operations with PostgreSQL.

## Table of Contents
- [Database Configuration](#database-configuration)
- [Migrations](#migrations)
- [Seeders](#seeders)
- [Running Migrations](#running-migrations)
- [Available Commands](#available-commands)
- [Model Definition](#model-definition)
- [Repository Pattern](#repository-pattern)

## Database Configuration

The database configuration is split into two files:

1. **src/config/database.ts** - TypeScript configuration for the application
   - Used by the application at runtime
   - Initializes Sequelize instance with logging via Pino
   - Exports `testConnection()` and `closeConnection()` functions

2. **src/config/database.config.js** - JavaScript configuration for Sequelize CLI
   - Used by migration and seeder commands
   - Contains development, test, and production configurations
   - Reads environment variables from `.env` file

### Environment Variables

Configure your database connection in the `.env` file:

```env
# Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=express_mvc_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## Migrations

Migrations are located in `src/migrations/` directory.

### Creating a Migration

```bash
npx sequelize-cli migration:generate --name migration-name
```

### Migration Structure

Migrations are written in TypeScript and follow this structure:

```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    // Create table, add columns, etc.
    await queryInterface.createTable('table_name', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // ... other fields
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    // Rollback changes
    await queryInterface.dropTable('table_name');
  },
};
```

### Existing Migrations

1. **20240101000000-create-users-table.ts**
   - Creates `users` table with id, name, email, created_at, updated_at
   - Adds unique index on email
   - Adds index on name for search performance

## Seeders

Seeders are located in `src/seeders/` directory and are used to populate the database with initial data.

### Creating a Seeder

```bash
npx sequelize-cli seed:generate --name seeder-name
```

### Seeder Structure

```typescript
import { QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert('table_name', [
      { /* data */ },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('table_name', { /* conditions */ });
  },
};
```

### Existing Seeders

1. **20240101000000-demo-users.ts**
   - Seeds two demo users: John Doe and Jane Smith

## Running Migrations

### Prerequisites

1. Ensure PostgreSQL is running:
```bash
podman-compose up -d postgres
# or
docker-compose up -d postgres
```

2. Verify database connection in `.env` file

### Step-by-Step Migration Process

1. **Run all pending migrations:**
```bash
npm run db:migrate
```

2. **Seed the database with initial data:**
```bash
npm run db:seed
```

3. **Start the application:**
```bash
npm run dev
```

### Troubleshooting

If migrations fail:

1. Check database connection:
```bash
psql -h localhost -U admin -d express_mvc_db
```

2. Check migration status:
```bash
npx sequelize-cli db:migrate:status
```

3. Rollback last migration:
```bash
npm run db:migrate:undo
```

## Available Commands

### Migration Commands

```bash
# Run all pending migrations
npm run db:migrate

# Undo the most recent migration
npm run db:migrate:undo

# Undo all migrations
npm run db:migrate:undo:all

# Create a new database
npm run db:create

# Drop the database
npm run db:drop
```

### Seeder Commands

```bash
# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo
```

### Direct Sequelize CLI Commands

```bash
# Create a new migration
npx sequelize-cli migration:generate --name migration-name

# Create a new seeder
npx sequelize-cli seed:generate --name seeder-name

# Check migration status
npx sequelize-cli db:migrate:status
```

## Model Definition

Models are defined in `src/models/` directory using Sequelize's TypeScript support.

### User Model Example

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes 
  extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> 
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    // ... timestamps configured automatically
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

export default User;
```

## Repository Pattern

The repository pattern abstracts database operations. All repositories implement the `IRepository<T>` interface.

### UserRepository Example

```typescript
import UserModel from '../models/User';

export class UserRepository implements IRepository<User> {
  public async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map(user => user.toJSON() as User);
  }

  public async findById(id: number): Promise<User | undefined> {
    const user = await UserModel.findByPk(id);
    return user ? (user.toJSON() as User) : undefined;
  }

  public async create(data: Partial<User>): Promise<User> {
    const newUser = await UserModel.create(data);
    return newUser.toJSON() as User;
  }

  // ... other methods
}
```

### Using Repositories in Services

```typescript
export class UserService {
  private userRepository: UserRepository;

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return await this.userRepository.create(userData);
  }
}
```

## Migration vs Init Scripts

**Previously:** The project used `init-scripts/01-init.sql` mounted as a Docker volume.

**Now:** Using Sequelize migrations provides:
- Version control for database schema
- Easy rollback capability
- Consistent schema across environments
- Better team collaboration
- Database-agnostic code (can switch from PostgreSQL to MySQL, etc.)

The init scripts have been removed and replaced with proper migrations and seeders.

## Best Practices

1. **Always create migrations for schema changes** - Never modify the database manually
2. **Test migrations in development** before applying to production
3. **Use meaningful migration names** - e.g., `add-user-profile-table`
4. **Keep migrations small and focused** - One logical change per migration
5. **Always provide a `down` method** - To enable rollbacks
6. **Use seeders for test data** - Keep production data separate
7. **Version control migrations** - Commit migrations to Git
8. **Document complex migrations** - Add comments explaining why

## Production Deployment

For production deployments:

1. Set `NODE_ENV=production`
2. Configure production database in `.env`
3. Run migrations:
```bash
NODE_ENV=production npm run db:migrate
```
4. Do NOT run seeders in production (unless intentional)
5. Consider using database backup before migrations

## Rollback Strategy

If a migration causes issues:

```bash
# Rollback last migration
npm run db:migrate:undo

# Rollback all migrations (CAUTION: data loss)
npm run db:migrate:undo:all

# Check current migration status
npx sequelize-cli db:migrate:status
```

## Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize CLI Documentation](https://github.com/sequelize/cli)
- [Sequelize TypeScript Guide](https://sequelize.org/docs/v6/other-topics/typescript/)
