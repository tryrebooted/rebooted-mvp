// Course Generation API Service
export interface GenerateCourseRequest {
  course_title: string;
  course_topics: string;
  course_description: string;
  starting_point_description: string;
  finish_line_description: string;
}

export interface GeneratedContentBlock {
  id?: number;
  title: string;
  body: string;
  type: 'Text' | 'Question';
  moduleId?: number;
  isComplete: boolean;
  options?: string[];
  correctAnswer?: string;
  questionText?: string;
}

export interface GeneratedModule {
  id?: number;
  title: string;
  body: string;
  courseId?: number;
  contentBlocks: GeneratedContentBlock[];
}

export interface GeneratedCourse {
  course_title: string;
  course_description: string;
  modules: GeneratedModule[];
}

class CourseGenerationService {
  private baseUrl = 'http://localhost:8001';

  async generateCourse(request: GenerateCourseRequest): Promise<GeneratedCourse> {
    const response = await fetch(`${this.baseUrl}/generate-course`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || 'Failed to generate course');
    }

    return response.json();
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const courseGenerationService = new CourseGenerationService(); 