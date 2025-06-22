import { backendClient } from '@/utils/backend/client';

// Type definitions to match backend DTOs
export interface CourseDTO {
  id: number;
  name: string;
  description: string;
  teacherCount: number;
  studentCount: number;
  moduleCount: number;
}

export interface NewCourseDTO {
  name: string;
  description: string;
}

export interface ModuleDTO {
  id: number;
  name: string;
  description: string;
  progress: number;
  courseId: number;
  contentCount: number;
}

export interface NewModuleDTO {
  name: string;
  description: string;
  courseId: number;
}

export interface ContentDTO {
  id: number;
  title: string;
  body: string;
  type: 'Text' | 'Question';
  isComplete: boolean;
  moduleId: number;
  position: number;
}

export interface NewContentDTO {
  title: string;
  body: string;
  type: 'Text' | 'Question';
  moduleId: number;
}

export interface UserProfileDTO {
  id: string;
  username: string;
  fullName: string;
  userType: string;
}

export interface UserCourseDTO {
  id: number;
  name: string;
  description: string;
  role: string;
}

export interface CourseUserDTO {
  courseId: number;
  userId: string;
  role: string;
  username: string;
  fullName: string;
}

// API Service Layer
export class BackendApiService {
  
  // Course Operations
  async getAllCourses(): Promise<CourseDTO[]> {
    return backendClient.get<CourseDTO[]>('/api/courses');
  }

  async getCourseById(id: number): Promise<CourseDTO> {
    return backendClient.get<CourseDTO>(`/api/courses/${id}`);
  }

  async createCourse(course: NewCourseDTO): Promise<CourseDTO> {
    return backendClient.post<CourseDTO>('/api/courses', course);
  }

  async updateCourse(id: number, course: NewCourseDTO): Promise<CourseDTO> {
    return backendClient.put<CourseDTO>(`/api/courses/${id}`, course);
  }

  async deleteCourse(id: number): Promise<void> {
    await backendClient.delete(`/api/courses/${id}`);
  }

  // Module Operations
  async getAllModules(): Promise<ModuleDTO[]> {
    return backendClient.get<ModuleDTO[]>('/api/modules');
  }

  async getModuleById(id: number): Promise<ModuleDTO> {
    return backendClient.get<ModuleDTO>(`/api/modules/${id}`);
  }

  async getModulesByCourseId(courseId: number): Promise<ModuleDTO[]> {
    return backendClient.get<ModuleDTO[]>(`/api/modules/course/${courseId}`);
  }

  async createModule(module: NewModuleDTO): Promise<ModuleDTO> {
    return backendClient.post<ModuleDTO>('/api/modules', module);
  }

  async updateModule(id: number, module: NewModuleDTO): Promise<ModuleDTO> {
    return backendClient.put<ModuleDTO>(`/api/modules/${id}`, module);
  }

  async deleteModule(id: number): Promise<void> {
    await backendClient.delete(`/api/modules/${id}`);
  }

  // Content Operations
  async getAllContent(): Promise<ContentDTO[]> {
    return backendClient.get<ContentDTO[]>('/api/content');
  }

  async getContentById(id: number): Promise<ContentDTO> {
    return backendClient.get<ContentDTO>(`/api/content/${id}`);
  }

  async getContentByModuleId(moduleId: number): Promise<ContentDTO[]> {
    return backendClient.get<ContentDTO[]>(`/api/content/module/${moduleId}`);
  }

  async createContent(content: NewContentDTO): Promise<ContentDTO> {
    return backendClient.post<ContentDTO>('/api/content', content);
  }

  async updateContent(id: number, content: NewContentDTO): Promise<ContentDTO> {
    return backendClient.put<ContentDTO>(`/api/content/${id}`, content);
  }

  async deleteContent(id: number): Promise<void> {
    await backendClient.delete(`/api/content/${id}`);
  }

  async markContentComplete(id: number): Promise<ContentDTO> {
    return backendClient.post<ContentDTO>(`/api/content/${id}/complete`);
  }

  async submitAnswer(id: number, answer: string): Promise<ContentDTO> {
    return backendClient.post<ContentDTO>(`/api/content/${id}/answer`, { answer });
  }

  // User Operations
  async getAllUsers(): Promise<UserProfileDTO[]> {
    return backendClient.get<UserProfileDTO[]>('/api/users');
  }

  async getUserById(id: string): Promise<UserProfileDTO> {
    return backendClient.get<UserProfileDTO>(`/api/users/${id}`);
  }

  async getUserByUsername(username: string): Promise<UserProfileDTO> {
    return backendClient.get<UserProfileDTO>(`/api/users/username/${username}`);
  }

  async validateUsernames(usernames: string[]): Promise<{ [username: string]: boolean }> {
    return backendClient.post<{ [username: string]: boolean }>('/api/users/validate', { usernames });
  }

  async searchUsersByUsernames(usernames: string[]): Promise<UserProfileDTO[]> {
    return backendClient.post<UserProfileDTO[]>('/api/users/search', { usernames });
  }

  // Course Membership Operations
  async getCourseUsers(courseId: number): Promise<CourseUserDTO[]> {
    return backendClient.get<CourseUserDTO[]>(`/api/course-memberships/course/${courseId}/users`);
  }

  async getUserCourses(userId: string): Promise<UserCourseDTO[]> {
    return backendClient.get<UserCourseDTO[]>(`/api/course-memberships/user/${userId}/courses`);
  }

  async addUserToCourse(courseId: number, userId: string, role: string): Promise<string> {
    return backendClient.post<string>(`/api/course-memberships/course/${courseId}/users`, { userId, role });
  }

  async addTeachersToCourse(courseId: number, usernames: string[]): Promise<string> {
    return backendClient.post<string>(`/api/course-memberships/course/${courseId}/teachers`, { usernames });
  }

  async addStudentsToCourse(courseId: number, usernames: string[]): Promise<string> {
    return backendClient.post<string>(`/api/course-memberships/course/${courseId}/students`, { usernames });
  }

  async removeUserFromCourse(courseId: number, userId: string): Promise<string> {
    return backendClient.delete<string>(`/api/course-memberships/course/${courseId}/users/${userId}`);
  }
}

// Export singleton instance
export const apiService = new BackendApiService();