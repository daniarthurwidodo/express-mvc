# 🚀 Quick Reference Guide

## New Features at a Glance

### 📁 Repository Pattern
```typescript
// Import
import { UserRepository } from '../repositories/UserRepository';

// Usage
const repo = new UserRepository();
const users = repo.findAll();
const user = repo.findById(1);
const searchResults = repo.search('john');
```

### 🛠️ HTTP Response Utilities
```typescript
// Import
import { HttpResponse, HttpStatus } from '../utils/httpResponse';

// Success Responses
HttpResponse.success(res, data);                    // 200
HttpResponse.created(res, data, message);           // 201
HttpResponse.noContent(res);                        // 204

// Error Responses
HttpResponse.badRequest(res, message);              // 400
HttpResponse.unauthorized(res, message);            // 401
HttpResponse.forbidden(res, message);               // 403
HttpResponse.notFound(res, message);                // 404
HttpResponse.conflict(res, message);                // 409
HttpResponse.unprocessableEntity(res, msg, errors); // 422
HttpResponse.internalError(res, message);           // 500
HttpResponse.serviceUnavailable(res, message);      // 503
```

### 📝 Logging
```typescript
// Import
import { Logger } from '../utils/logger';

// Create logger
const logger = new Logger({ module: 'ModuleName' });

// Log methods
logger.trace('Trace message', data);
logger.debug('Debug message', data);
logger.info('Info message', data);
logger.warn('Warning message', data);
logger.error('Error message', error);
logger.fatal('Fatal message', error);

// Child logger with context
const childLogger = logger.child({ userId: 123 });
```

### 🛑 Graceful Shutdown
```bash
# Test graceful shutdown
# Start server
npm run dev

# Then press Ctrl+C
# Or send signal: kill $(lsof -ti:3000)
```

## Controller Template
```typescript
import { Request, Response } from 'express';
import { HttpResponse } from '../utils/httpResponse';
import { Logger } from '../utils/logger';
import { YourService } from '../services/YourService';

export class YourController {
  private service: YourService;
  private logger: Logger;

  constructor() {
    this.service = new YourService();
    this.logger = new Logger({ module: 'YourController' });
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      this.logger.info('Fetching all items');
      const items = this.service.getAll();
      HttpResponse.success(res, items);
    } catch (error) {
      this.logger.error('Error fetching items', error as Error);
      HttpResponse.internalError(res, 'Failed to fetch items');
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        HttpResponse.badRequest(res, 'ID is required');
        return;
      }

      this.logger.info(`Fetching item with ID: ${id}`);
      const item = this.service.getById(parseInt(id));
      
      if (!item) {
        HttpResponse.notFound(res, 'Item not found');
        return;
      }

      HttpResponse.success(res, item);
    } catch (error) {
      this.logger.error('Error fetching item', error as Error);
      HttpResponse.internalError(res, 'Failed to fetch item');
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      
      if (!data.name) {
        HttpResponse.badRequest(res, 'Name is required');
        return;
      }

      this.logger.info('Creating new item');
      const newItem = this.service.create(data);
      HttpResponse.created(res, newItem, 'Item created successfully');
    } catch (error) {
      this.logger.error('Error creating item', error as Error);
      HttpResponse.internalError(res, 'Failed to create item');
    }
  }
}
```

## Service Template
```typescript
import { Logger } from '../utils/logger';
import { YourRepository } from '../repositories/YourRepository';

export class YourService {
  private repository: YourRepository;
  private logger: Logger;

  constructor() {
    this.repository = new YourRepository();
    this.logger = new Logger({ module: 'YourService' });
  }

  public getAll(): Item[] {
    this.logger.debug('Fetching all items from repository');
    const items = this.repository.findAll();
    this.logger.info(`Found ${items.length} items`);
    return items;
  }

  public getById(id: number): Item | undefined {
    this.logger.debug(`Fetching item with ID: ${id}`);
    const item = this.repository.findById(id);
    
    if (item) {
      this.logger.info(`Item found: ${item.name}`);
    } else {
      this.logger.warn(`Item not found with ID: ${id}`);
    }
    
    return item;
  }

  public create(data: CreateItemDto): Item {
    this.logger.debug(`Creating item: ${data.name}`);
    const newItem = this.repository.create(data);
    this.logger.info(`Item created successfully (ID: ${newItem.id})`);
    return newItem;
  }
}
```

## Repository Template
```typescript
import { IRepository } from './IRepository';

export class YourRepository implements IRepository<Item> {
  private items: Item[] = [];

  public findAll(): Item[] {
    return this.items;
  }

  public findById(id: number | string): Item | undefined {
    const itemId = typeof id === 'string' ? parseInt(id) : id;
    return this.items.find(item => item.id === itemId);
  }

  public create(data: Partial<Item>): Item {
    const newItem: Item = {
      id: Date.now(),
      ...data as Item,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.items.push(newItem);
    return newItem;
  }

  public update(id: number | string, data: Partial<Item>): Item | undefined {
    const itemId = typeof id === 'string' ? parseInt(id) : id;
    const index = this.items.findIndex(item => item.id === itemId);
    
    if (index === -1) return undefined;
    
    const existing = this.items[index];
    if (!existing) return undefined;
    
    const updated: Item = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    
    this.items[index] = updated;
    return updated;
  }

  public delete(id: number | string): boolean {
    const itemId = typeof id === 'string' ? parseInt(id) : id;
    const index = this.items.findIndex(item => item.id === itemId);
    
    if (index === -1) return false;
    
    this.items.splice(index, 1);
    return true;
  }
}
```

## Environment Variables
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

## NPM Scripts
```bash
npm run dev      # Development with hot reload
npm run build    # Build TypeScript
npm start        # Run production build
npm run clean    # Clean dist folder
```

## Common Patterns

### Error Handling
```typescript
try {
  // Your code
  HttpResponse.success(res, data);
} catch (error) {
  logger.error('Error message', error as Error);
  HttpResponse.internalError(res, 'Failed message');
}
```

### Validation
```typescript
if (!id) {
  HttpResponse.badRequest(res, 'ID is required');
  return;
}

if (isNaN(userId)) {
  HttpResponse.badRequest(res, 'Invalid ID format');
  return;
}
```

### Not Found Checks
```typescript
const item = service.getById(id);

if (!item) {
  HttpResponse.notFound(res, 'Item not found');
  return;
}
```

### Conflict Checks
```typescript
const existing = service.findByEmail(email);

if (existing) {
  HttpResponse.conflict(res, 'Item already exists');
  return;
}
```

## Testing Commands

```bash
# Test success response
curl http://localhost:3000/api/users

# Test created response
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# Test not found
curl http://localhost:3000/api/users/999

# Test bad request
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{}'

# Test conflict
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

## Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    "id": 1,
    "name": "Item name"
  },
  "timestamp": "2025-12-17T10:30:00.000Z"
}
```

## Log Levels
- `trace` - Most detailed debugging
- `debug` - Debug information
- `info` - General information  
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal errors

---

**Happy coding! 🚀**
