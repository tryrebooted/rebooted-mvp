# Module API

## Overview
The Module API provides endpoints for managing modules within courses.

## Endpoints

### Get All Modules
Retrieve a list of all modules.

**Request:**
```http
GET /api/modules
```

**Response:**
```http
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Introduction to Variables",
    "description": "Learn about variables in programming",
    "progress": 0.5,
    "courseId": 1,
    "contentCount": 5
  }
]
```

### Get Module by ID
Retrieve a specific module by its ID.

**Request:**
```http
GET /api/modules/{id}
```

**Parameters:**
- `id` (path parameter) - Module ID

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Introduction to Variables",
  "description": "Learn about variables in programming",
  "progress": 0.5,
  "courseId": 1,
  "contentCount": 5
}
```

**Error Response:**
```http
404 Not Found
```

### Get Modules by Course ID
Retrieve all modules for a specific course.

**Request:**
```http
GET /api/modules/course/{courseId}
```

**Parameters:**
- `courseId` (path parameter) - Course ID

**Response:**
```http
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Introduction to Variables",
    "description": "Learn about variables in programming",
    "progress": 0.5,
    "courseId": 1,
    "contentCount": 5
  }
]
```

### Create Module
Create a new module.

**Request:**
```http
POST /api/modules
Content-Type: application/json

{
  "name": "Introduction to Variables",
  "description": "Learn about variables in programming",
  "courseId": 1
}
```

**Response:**
```http
201 Created
Content-Type: application/json

{
  "id": 1,
  "name": "Introduction to Variables",
  "description": "Learn about variables in programming",
  "progress": 0.0,
  "courseId": 1,
  "contentCount": 0
}
```

**Error Response:**
```http
400 Bad Request
```
*When module name is empty or courseId is null*

### Update Module
Update an existing module.

**Request:**
```http
PUT /api/modules/{id}
Content-Type: application/json

{
  "name": "Advanced Variables",
  "description": "Advanced concepts about variables",
  "courseId": 1
}
```

**Parameters:**
- `id` (path parameter) - Module ID

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Advanced Variables",
  "description": "Advanced concepts about variables",
  "progress": 0.5,
  "courseId": 1,
  "contentCount": 5
}
```

**Error Responses:**
```http
404 Not Found
```
*When module doesn't exist*

```http
400 Bad Request
```
*When request data is invalid*

### Delete Module
Delete a module by ID.

**Request:**
```http
DELETE /api/modules/{id}
```

**Parameters:**
- `id` (path parameter) - Module ID

**Response:**
```http
204 No Content
```

**Error Response:**
```http
404 Not Found
```
*When module doesn't exist*

## Examples

### Creating a Module with curl
```bash
curl -X POST http://localhost:8080/api/modules \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Data Types",
    "description": "Learn about different data types",
    "courseId": 1
  }'
```

### Getting Modules for a Course with curl
```bash
curl http://localhost:8080/api/modules/course/1
```

### Updating a Module with curl
```bash
curl -X PUT http://localhost:8080/api/modules/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Data Types",
    "description": "Advanced concepts about data types",
    "courseId": 1
  }'
```

### Deleting a Module with curl
```bash
curl -X DELETE http://localhost:8080/api/modules/1
```