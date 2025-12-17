# Express TypeScript MVC

A modern Express.js application built with TypeScript following the MVC (Model-View-Controller) pattern with a service layer.

## Features

- 🚀 TypeScript for type safety
- 📁 MVC architecture with service layer
- 🔄 Hot reload with nodemon
- ✅ Strict TypeScript configuration
- 🎯 RESTful API endpoints
- 🌍 Multi-language support

## Project Structure

```
express-mvc/
├── src/
│   ├── controllers/      # Request handlers
│   │   ├── HelloController.ts
│   │   └── UserController.ts
│   ├── services/        # Business logic
│   │   ├── HelloService.ts
│   │   └── UserService.ts
│   ├── routes/          # API routes
│   │   ├── index.ts
│   │   ├── helloRoutes.ts
│   │   └── userRoutes.ts
│   ├── middleware/      # Custom middleware
│   │   └── errorHandler.ts
│   ├── types/          # TypeScript interfaces
│   │   └── User.ts
│   └── index.ts        # Application entry point
├── dist/               # Compiled JavaScript files
├── tsconfig.json       # TypeScript configuration
├── nodemon.json        # Nodemon configuration
└── package.json        # Project dependencies

```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the compiled application:

```bash
npm start
```

## API Endpoints

### Base Endpoints

#### GET /
Get API information and available endpoints
```bash
curl http://localhost:3000
```

#### GET /health
Health check endpoint
```bash
curl http://localhost:3000/health
```

### Hello World Endpoints

#### GET /api/hello
Get a hello world message (default: English)
```bash
curl http://localhost:3000/api/hello

# With language parameter
curl http://localhost:3000/api/hello?lang=es
curl http://localhost:3000/api/hello?lang=fr
```

**Supported languages:** en, es, fr, de, it, pt, ja, ko, zh

#### GET /api/hello/personalized/:name
Get a personalized hello message
```bash
curl http://localhost:3000/api/hello/personalized/John

# With language parameter
curl http://localhost:3000/api/hello/personalized/Maria?lang=es
```

#### GET /api/hello/random
Get a random hello message in a random language
```bash
curl http://localhost:3000/api/hello/random
```

#### GET /api/hello/languages
Get all supported languages
```bash
curl http://localhost:3000/api/hello/languages
```

### User Endpoints

#### GET /api/users
Get all users
```bash
curl http://localhost:3000/api/users

# Search users by name or email
curl http://localhost:3000/api/users?search=john
```

#### GET /api/users/:id
Get a specific user by ID
```bash
curl http://localhost:3000/api/users/1
```

#### POST /api/users
Create a new user
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

#### PUT /api/users/:id
Update a user
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'
```

#### DELETE /api/users/:id
Delete a user
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

## Architecture

### MVC Pattern

This application follows the MVC pattern with an additional service layer:

- **Models** (`src/types/`): Define data structures and interfaces
- **Views**: JSON responses (API-only application)
- **Controllers** (`src/controllers/`): Handle HTTP requests/responses
- **Services** (`src/services/`): Contain business logic
- **Routes** (`src/routes/`): Define API endpoints

### Service Layer

The service layer separates business logic from controllers, making the code:
- More testable
- Easier to maintain
- More reusable
- Better organized

Example flow:
```
Route → Controller → Service → Data/Logic → Service → Controller → Response
```

## TypeScript Configuration

The project uses strict TypeScript configuration for maximum type safety:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `exactOptionalPropertyTypes: true`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled application
- `npm run clean` - Remove dist folder

## Technologies

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **ts-node** - TypeScript execution
- **nodemon** - Hot reload in development
- **body-parser** - Parse request bodies
- **axios** - HTTP client

## License

ISC

## Author

Your Name
