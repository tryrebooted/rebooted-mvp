// src/types/backend-aliases.ts

import type { components } from './backend-api';

// Re-export the types you need
export type Course = components["schemas"]["CourseDTO"];
export type Module = components["schemas"]["ModuleDTO"];
export type Content = components["schemas"]["ContentDTO"];
export type ContentResponse = components["schemas"]["ContentDTO"]; // use same if applicable
export type UserProfile = components["schemas"]["UserProfileDTO"];
export type UserCourse = components["schemas"]["UserCourseDTO"];
export type CourseUser = components["schemas"]["CourseUserDTO"];

export type NewCourseRequest = components["schemas"]["NewCourseDTO"];
export type NewModuleRequest = components["schemas"]["NewModuleDTO"];
export type NewContentRequest = components["schemas"]["NewContentDTO"];
export type UpdateCourseRequest = components["schemas"]["NewCourseDTO"];
export type UpdateModuleRequest = components["schemas"]["NewModuleDTO"];
export type UpdateContentRequest = components["schemas"]["NewContentDTO"];

// export type SubmitAnswerRequest = components["schemas"]["SubmitAnswerDTO"];