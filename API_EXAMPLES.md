# API Examples & Testing

This document shows example requests and responses for testing the API.

## Test Hello World Endpoints

### 1. Basic Hello World (English)

**Request:**
```bash
curl http://localhost:3000/api/hello
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello World!",
    "timestamp": "2025-12-17T...",
    "language": "en"
  }
}
```

### 2. Hello World in Spanish

**Request:**
```bash
curl http://localhost:3000/api/hello?lang=es
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "¡Hola Mundo!",
    "timestamp": "2025-12-17T...",
    "language": "es"
  }
}
```

### 3. Personalized Hello

**Request:**
```bash
curl http://localhost:3000/api/hello/personalized/Alice
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Hello Alice!",
    "timestamp": "2025-12-17T...",
    "language": "en"
  }
}
```

### 4. Random Hello

**Request:**
```bash
curl http://localhost:3000/api/hello/random
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "こんにちは世界！",
    "timestamp": "2025-12-17T...",
    "language": "ja"
  }
}
```

### 5. Get Supported Languages

**Request:**
```bash
curl http://localhost:3000/api/hello/languages
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "languages": ["en", "es", "fr", "de", "it", "pt", "ja", "ko", "zh"],
    "count": 9
  }
}
```

## Test User Endpoints

### 1. Get All Users

**Request:**
```bash
curl http://localhost:3000/api/users
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    }
  ],
  "count": 2
}
```

### 2. Create a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson", "email": "alice@example.com"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1734441234567,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "createdAt": "2025-12-17T...",
    "updatedAt": "2025-12-17T..."
  },
  "message": "User created successfully"
}
```

### 3. Search Users

**Request:**
```bash
curl http://localhost:3000/api/users?search=john
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-12-17T...",
      "updatedAt": "2025-12-17T..."
    }
  ],
  "count": 1
}
```

## Quick Test Script

Save this as `test-api.sh` and run it to test all endpoints:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "=== Testing Hello Endpoints ==="
echo "1. Basic Hello:"
curl -s $BASE_URL/api/hello | jq

echo -e "\n2. Hello in Spanish:"
curl -s "$BASE_URL/api/hello?lang=es" | jq

echo -e "\n3. Personalized Hello:"
curl -s $BASE_URL/api/hello/personalized/Alice | jq

echo -e "\n4. Random Hello:"
curl -s $BASE_URL/api/hello/random | jq

echo -e "\n5. Supported Languages:"
curl -s $BASE_URL/api/hello/languages | jq

echo -e "\n=== Testing User Endpoints ==="
echo "6. Get All Users:"
curl -s $BASE_URL/api/users | jq

echo -e "\n7. Create User:"
curl -s -X POST $BASE_URL/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Wilson","email":"bob@example.com"}' | jq

echo -e "\n8. Search Users:"
curl -s "$BASE_URL/api/users?search=john" | jq
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Using HTTPie (Alternative to curl)

If you have HTTPie installed, you can use these cleaner commands:

```bash
# Hello endpoints
http GET :3000/api/hello
http GET :3000/api/hello lang==es
http GET :3000/api/hello/personalized/Alice
http GET :3000/api/hello/random
http GET :3000/api/hello/languages

# User endpoints
http GET :3000/api/users
http POST :3000/api/users name="Bob Wilson" email="bob@example.com"
http GET :3000/api/users search==john
```

## Using Postman

1. Create a new collection called "Express TypeScript MVC"
2. Import the endpoints from the README
3. Set the base URL to `http://localhost:3000`
4. Create requests for each endpoint
5. Use the Environment feature to manage different environments (dev, staging, prod)
