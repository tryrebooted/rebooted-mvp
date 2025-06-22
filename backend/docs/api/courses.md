# Course API

## Overview
The Course API provides endpoints for managing courses in the learning and development platform.

## Endpoints

### Get All Courses
Retrieve a list of all courses.

**Request:**
```http
GET /api/courses
```

**Response:**
```http
200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "name": "Java Fundamentals",
    "description": "Learn Java programming basics",
    "teacherCount": 0,
    "studentCount": 0,
    "moduleCount": 0
  }
]
```

### Get Course by ID
Retrieve a specific course by its ID.

**Request:**
```http
GET /api/courses/{id}
```

**Parameters:**
- `id` (path parameter) - Course ID

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Java Fundamentals",
  "description": "Learn Java programming basics",
  "teacherCount": 0,
  "studentCount": 0,
  "moduleCount": 0
}
```

**Error Response:**
```http
404 Not Found
```

### Create Course
Create a new course.

**Request:**
```http
POST /api/courses
Content-Type: application/json

{
  "name": "Java Fundamentals",
  "description": "Learn Java programming basics"
}
```

**Response:**
```http
201 Created
Content-Type: application/json

{
  "id": 1,
  "name": "Java Fundamentals",
  "description": "Learn Java programming basics",
  "teacherCount": 0,
  "studentCount": 0,
  "moduleCount": 0
}
```

**Error Response:**
```http
400 Bad Request
```
*When course name is empty or null*

### Update Course
Update an existing course.

**Request:**
```http
PUT /api/courses/{id}
Content-Type: application/json

{
  "name": "Advanced Java",
  "description": "Advanced Java programming concepts"
}
```

**Parameters:**
- `id` (path parameter) - Course ID

**Response:**
```http
200 OK
Content-Type: application/json

{
  "id": 1,
  "name": "Advanced Java",
  "description": "Advanced Java programming concepts",
  "teacherCount": 0,
  "studentCount": 0,
  "moduleCount": 0
}
```

**Error Responses:**
```http
404 Not Found
```
*When course doesn't exist*

```http
400 Bad Request
```
*When request data is invalid*

### Delete Course
Delete a course by ID.

**Request:**
```http
DELETE /api/courses/{id}
```

**Parameters:**
- `id` (path parameter) - Course ID

**Response:**
```http
204 No Content
```

**Error Response:**
```http
404 Not Found
```
*When course doesn't exist*

## Examples

### Creating a Course with curl
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Boot Basics",
    "description": "Introduction to Spring Boot framework"
  }'
```

### Getting All Courses with curl
```bash
curl http://localhost:8080/api/courses
```

### Updating a Course with curl
```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Spring Boot Advanced",
    "description": "Advanced Spring Boot concepts and patterns"
  }'
```

### Deleting a Course with curl
```bash
curl -X DELETE http://localhost:8080/api/courses/1
```