# Rebooted MVP API Documentation

## Overview
This is the REST API for the Rebooted MVP learning and development platform. The API provides endpoints for managing courses, modules, and user interactions.

## Base URL
```
http://localhost:8080/api
```

## API Version
Version 1.0 (Current)

## Authentication
Currently, the API does not require authentication. This will be added in future versions.

## Content Type
All API endpoints accept and return JSON data.
```
Content-Type: application/json
```

## HTTP Status Codes
The API uses standard HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Resource deleted successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format
```json
{
  "error": "Error message description"
}
```

## Available Endpoints

### Courses API
- [Course Management](./courses.md) - CRUD operations for courses

### Modules API
- [Module Management](./modules.md) - CRUD operations for modules within courses

### Content API
- [Content Management](./content.md) - CRUD operations for content blocks (text and questions)

### Users API
- [User Profile Management](./users.md) - User profile operations and validation

## Data Models
- [Schema Definitions](./schemas.md) - DTO and data structure definitions

## Getting Started
See the [setup guide](../setup/getting-started.md) for development environment setup.