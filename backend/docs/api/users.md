# User Profile API

## Overview
The User Profile API provides endpoints for managing user profiles and user validation.

## Endpoints

### Get All Users
Retrieve a list of all user profiles.

**Request:**
```http
GET /api/users
```

**Response:**
```http
200 OK
Content-Type: application/json

[
  {
    "id": "user123",
    "username": "johndoe",
    "fullName": "John Doe",
    "userType": "LDUser"
  }
]
```

### Get User by ID
Retrieve a specific user profile by its ID.

**Request:**
```http
GET /api/users/{id}
```

**Parameters:**
- `id` (path parameter) - User ID

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": "user123",
  "username": "johndoe",
  "fullName": "John Doe",
  "userType": "LDUser"
}
```

**Error Response:**
```http
404 Not Found
```

### Get User by Username
Retrieve a specific user profile by username.

**Request:**
```http
GET /api/users/username/{username}
```

**Parameters:**
- `username` (path parameter) - Username

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": "user123",
  "username": "johndoe",
  "fullName": "John Doe",
  "userType": "LDUser"
}
```

**Error Response:**
```http
404 Not Found
```

### Validate Usernames
Validate a list of usernames and return which ones exist.

**Request:**
```http
POST /api/users/validate
Content-Type: application/json

{
  "usernames": ["johndoe", "janedoe", "nonexistent"]
}
```

**Response:**
```http
200 OK
Content-Type: application/json

{
  "johndoe": true,
  "janedoe": true,
  "nonexistent": false
}
```

**Error Response:**
```http
400 Bad Request
```
*When usernames array is missing*

### Search Users by Usernames
Retrieve user profiles for a list of usernames.

**Request:**
```http
POST /api/users/search
Content-Type: application/json

{
  "usernames": ["johndoe", "janedoe"]
}
```

**Response:**
```http
200 OK
Content-Type: application/json

[
  {
    "id": "user123",
    "username": "johndoe",
    "fullName": "John Doe",
    "userType": "LDUser"
  },
  {
    "id": "user456",
    "username": "janedoe",
    "fullName": "Jane Doe",
    "userType": "EmployeeUser"
  }
]
```

**Error Response:**
```http
400 Bad Request
```
*When usernames array is missing*

## Examples

### Getting All Users with curl
```bash
curl http://localhost:8080/api/users
```

### Getting User by Username with curl
```bash
curl http://localhost:8080/api/users/username/johndoe
```

### Validating Usernames with curl
```bash
curl -X POST http://localhost:8080/api/users/validate \
  -H "Content-Type: application/json" \
  -d '{
    "usernames": ["johndoe", "janedoe", "nonexistent"]
  }'
```

### Searching Users by Usernames with curl
```bash
curl -X POST http://localhost:8080/api/users/search \
  -H "Content-Type: application/json" \
  -d '{
    "usernames": ["johndoe", "janedoe"]
  }'
```