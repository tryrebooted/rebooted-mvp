# API Schema Definitions

## Data Transfer Objects (DTOs)

### CourseDTO
Represents a course in API responses.

```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "teacherCount": 0,
  "studentCount": 0,
  "moduleCount": 0
}
```

**Fields:**
- `id` (Long) - Unique identifier for the course
- `name` (String) - Course name
- `description` (String) - Course description
- `teacherCount` (Integer) - Number of teachers assigned to the course
- `studentCount` (Integer) - Number of students enrolled in the course
- `moduleCount` (Integer) - Number of modules in the course

### NewCourseDTO
Used for creating and updating courses.

```json
{
  "name": "string",
  "description": "string"
}
```

**Fields:**
- `name` (String, required) - Course name. Cannot be empty or null.
- `description` (String, optional) - Course description

**Validation Rules:**
- `name` is required and cannot be empty or contain only whitespace
- `description` is optional and can be null

## Domain Objects

### Course Interface
The core course interface that defines course behavior.

**Methods:**
- `get_teachers()` - Returns Set<LDUser> of teachers
- `get_students()` - Returns Set<LDUser> of students  
- `get_modules()` - Returns List<Module> of course modules
- `getDescription()` - Returns course description
- `getProgress(User user)` - Returns progress for a specific user

### CourseImpl
Concrete implementation of the Course interface.

**Fields:**
- `id` (Long) - Course identifier
- `name` (String) - Course name
- `description` (String) - Course description
- `teachers` (Set<LDUser>) - Set of teacher users
- `students` (Set<LDUser>) - Set of student users
- `modules` (List<Module>) - List of course modules

## Response Examples

### Single Course Response
```json
{
  "id": 1,
  "name": "Java Fundamentals",
  "description": "Introduction to Java programming language",
  "teacherCount": 2,
  "studentCount": 15,
  "moduleCount": 8
}
```

### Course List Response
```json
[
  {
    "id": 1,
    "name": "Java Fundamentals",
    "description": "Introduction to Java programming",
    "teacherCount": 2,
    "studentCount": 15,
    "moduleCount": 8
  },
  {
    "id": 2,
    "name": "Spring Boot Basics",
    "description": "Learn Spring Boot framework",
    "teacherCount": 1,
    "studentCount": 12,
    "moduleCount": 6
  }
]
```

### Error Response
```json
{
  "error": "Course name cannot be empty"
}
```

## Future Schema Extensions

The following schemas will be added as the platform develops:

### ModuleDTO (Planned)
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "contentCount": 0,
  "progress": 0.0
}
```

### UserDTO (Planned)
```json
{
  "id": 1,
  "name": "string",
  "userType": "LDUser|EmployeeUser",
  "courseCount": 0
}
```