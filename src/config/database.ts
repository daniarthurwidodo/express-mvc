import { Sequelize, Options } from 'sequelize';
import { Logger } from '../utils/logger';

const logger = new Logger({ module: 'Database' });

const env = process.env.NODE_ENV || 'development';

interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: 'postgres';
  logging?: boolean | ((sql: string, timing?: number) => void);
  pool?: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

const config: Record<string, DatabaseConfig> = {
  development: {
    username: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'admin123',
    database: process.env.POSTGRES_DB || 'express_mvc_db',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: (sql: string) => logger.debug(sql),
  },
  test: {
    username: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'admin123',
    database: process.env.POSTGRES_DB_TEST || 'express_mvc_test',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.POSTGRES_USER || '',
    password: process.env.POSTGRES_PASSWORD || '',
    database: process.env.POSTGRES_DB || '',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000,
    },
  },
};

const dbConfig = config[env];

if (!dbConfig) {
  throw new Error(`Database configuration not found for environment: ${env}`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig as Options
);

// Test database connection
export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to database', error as Error);
    throw error;
  }
}

// Close database connection
export async function closeConnection(): Promise<void> {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', error as Error);
    throw error;
  }
}

export default sequelize;
export { sequelize, config };
