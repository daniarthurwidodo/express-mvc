# Express TypeScript MVC Architecture

## Overview

This document explains the architecture and design patterns used in this Express TypeScript MVC application.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT REQUEST                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                        │
│                   (src/index.ts)                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     MIDDLEWARE                           │
│            (body-parser, error handler)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                       ROUTES                             │
│                  (src/routes/)                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ userRoutes   │  │ helloRoutes  │                    │
│  └──────────────┘  └──────────────┘                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    CONTROLLERS                           │
│                (src/controllers/)                       │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │UserController│  │HelloController│                   │
│  └──────┬───────┘  └───────┬──────┘                    │
└─────────┼────────────────────┼─────────────────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                     SERVICES                             │
│                 (src/services/)                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ UserService  │  │ HelloService │                    │
│  └──────┬───────┘  └───────┬──────┘                    │
└─────────┼────────────────────┼─────────────────────────┘
          │                    │
          ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                  MODELS / TYPES                          │
│                   (src/types/)                          │
│            ┌────────────────────┐                       │
│            │    User Interface  │                       │
│            └────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                DATABASE / DATA LAYER                     │
│              (In-memory for now)                        │
└─────────────────────────────────────────────────────────┘
```

## Request Flow

### Example: GET /api/users

```
1. Client sends request → GET /api/users
                          │
2. Express Router  ────────┤
                          │
3. Routes Layer   ────────┼──→ userRoutes.ts
                          │
4. Controller     ────────┼──→ UserController.getUsers()
                          │
5. Service        ────────┼──→ UserService.getAllUsers()
                          │
6. Data Layer     ────────┼──→ Returns user data
                          │
7. Service        ────────┼──→ Processes data
                          │
8. Controller     ────────┼──→ Formats response
                          │
9. Response       ────────┘──→ JSON back to client
```

## Layer Responsibilities

### 1. Routes (`src/routes/`)

**Purpose:** Define API endpoints and map them to controllers

**Responsibilities:**
- Define HTTP methods (GET, POST, PUT, DELETE)
- Map URLs to controller methods
- Group related endpoints

**Example:**
```typescript
router.get('/users', userController.getUsers.bind(userController));
router.post('/users', userController.createUser.bind(userController));
```

### 2. Controllers (`src/controllers/`)

**Purpose:** Handle HTTP requests and responses

**Responsibilities:**
- Extract data from requests (params, query, body)
- Validate input data
- Call appropriate service methods
- Format and send responses
- Handle HTTP status codes
- Error handling

**Should NOT:**
- Contain business logic
- Directly access databases
- Perform complex calculations

**Example:**
```typescript
public async getUsers(req: Request, res: Response): Promise<void> {
  const users = this.userService.getAllUsers();
  res.status(200).json({ success: true, data: users });
}
```

### 3. Services (`src/services/`)

**Purpose:** Contain business logic and data operations

**Responsibilities:**
- Business logic implementation
- Data manipulation
- Interact with data layer
- Validate business rules
- Perform calculations

**Should NOT:**
- Handle HTTP requests/responses
- Know about Express.js
- Deal with HTTP status codes

**Example:**
```typescript
public getAllUsers(): User[] {
  return this.users;
}

public createUser(userData: CreateUserDto): User {
  // Business logic here
  const newUser = { /* ... */ };
  this.users.push(newUser);
  return newUser;
}
```

### 4. Types/Models (`src/types/`)

**Purpose:** Define data structures and interfaces

**Responsibilities:**
- Define TypeScript interfaces
- Type definitions
- Data transfer objects (DTOs)

**Example:**
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
}
```

### 5. Middleware (`src/middleware/`)

**Purpose:** Process requests before they reach controllers

**Responsibilities:**
- Error handling
- Authentication/Authorization
- Logging
- Request validation
- CORS handling

**Example:**
```typescript
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message });
};
```

## Design Patterns Used

### 1. MVC Pattern (Model-View-Controller)

- **Model:** Data structures and types (`src/types/`)
- **View:** JSON responses (API-only, no templates)
- **Controller:** Request handlers (`src/controllers/`)

### 2. Service Layer Pattern

Separates business logic from controllers into dedicated service classes.

**Benefits:**
- Better testability
- Code reusability
- Cleaner controllers
- Single Responsibility Principle

### 3. Dependency Injection

Controllers receive service instances through their constructors.

```typescript
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
}
```

### 4. DTO Pattern (Data Transfer Objects)

Use specific interfaces for data transfer:
- `CreateUserDto` - for creating users
- `UpdateUserDto` - for updating users
- `User` - complete user object

## Benefits of This Architecture

### 1. Separation of Concerns
Each layer has a specific responsibility, making the code easier to understand and maintain.

### 2. Testability
- Controllers can be tested independently from services
- Services can be tested without HTTP concerns
- Easy to mock dependencies

### 3. Maintainability
- Changes in one layer don't affect others
- Easy to locate and fix bugs
- Clear structure for new developers

### 4. Scalability
- Easy to add new features
- Can swap implementations (e.g., change database)
- Can add new endpoints without changing existing code

### 5. Reusability
- Service methods can be reused across different controllers
- Business logic is centralized
- Types can be shared across the application

## Type Safety with TypeScript

### Strict Configuration

The project uses strict TypeScript settings:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "exactOptionalPropertyTypes": true
}
```

**Benefits:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Refactoring confidence

### Type Inference

TypeScript can infer types in many cases:

```typescript
const users = this.userService.getAllUsers(); // Type: User[]
const user = this.userService.getUserById(1); // Type: User | undefined
```

## Error Handling Strategy

### 1. Try-Catch in Controllers

All controller methods use try-catch blocks to handle errors gracefully.

### 2. Error Middleware

A centralized error handler catches all unhandled errors.

### 3. Validation

- Input validation in controllers
- Business rule validation in services
- Type validation by TypeScript

### 4. HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error

## Future Enhancements

### 1. Database Integration
- Add Prisma or TypeORM for database access
- Replace in-memory data with persistent storage

### 2. Authentication & Authorization
- JWT authentication
- Role-based access control
- Protected routes

### 3. Validation Layer
- Add express-validator or Zod
- Create validation middleware

### 4. Logging
- Add Winston or Pino for logging
- Request/response logging
- Error logging

### 5. Testing
- Unit tests for services
- Integration tests for controllers
- E2E tests for API endpoints

### 6. API Documentation
- Add Swagger/OpenAPI
- Auto-generate documentation
- Interactive API explorer

### 7. Environment Configuration
- Add dotenv for environment variables
- Multiple environments (dev, staging, prod)
- Configuration validation

## Conclusion

This architecture provides a solid foundation for building scalable and maintainable Express.js applications with TypeScript. The separation of concerns and service layer pattern make it easy to test, maintain, and extend the application as requirements grow.
