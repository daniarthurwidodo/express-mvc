# Express MVC with TypeScript

A well-structured Express.js application using TypeScript with MVC architecture pattern.

## Project Structure

```
src/
├── controllers/     # Request handlers and business logic
├── middleware/      # Express middleware functions
├── models/          # Data models and database schemas
├── routes/          # Route definitions and routing logic
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
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

3. Copy environment variables:
```bash
cp .env.example .env
```

### Development

Start the development server with hot reloading:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Building

Build the TypeScript project:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run clean` - Remove build artifacts

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID  
- `POST /api/users` - Create a new user

### Example Requests

Get all users:
```bash
curl http://localhost:3000/api/users
```

Create a user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

## TypeScript Configuration

The project uses strict TypeScript configuration with:
- ES2020 target
- Strict type checking
- Source maps for debugging
- Automatic type declarations

## Architecture

This project follows the MVC (Model-View-Controller) pattern:

- **Models**: Define data structures and types
- **Views**: JSON responses (no templating engine)
- **Controllers**: Handle HTTP requests and responses
- **Routes**: Define API endpoints and map to controllers
- **Middleware**: Handle cross-cutting concerns like error handling

## Development Tools

- **TypeScript**: Static type checking
- **ts-node**: Direct TypeScript execution
- **nodemon**: Auto-restart on file changes
- **ESLint**: Code linting (can be added)
- **Prettier**: Code formatting (can be added)
