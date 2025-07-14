// src/utils/api/roster-client.ts

export interface NewRosterDTO {
    name: string;
    description: string;
}

export interface NewCourseDTO {
    // Match your backend's NewCourseDTO fields here
    // e.g. name: string;
    // description?: string;
}

export interface CourseDTO {
    id: number;
    name: string;
    // other course properties matching backend DTO
}

const BASE_URL = 'http://localhost:8080/api/roster';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
    }
    return res.json() as Promise<T>;
}

export async function createRoster(): Promise<number> {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
    });
    return handleResponse<number>(res);
}

export async function getAllCourses(): Promise<CourseDTO[]> {
    const res = await fetch(`${BASE_URL}`, { method: 'GET' });
    return handleResponse<CourseDTO[]>(res);
}

export async function getCourseById(courseId: number): Promise<CourseDTO> {
    const res = await fetch(`${BASE_URL}/${courseId}`, { method: 'GET' });
    return handleResponse<CourseDTO>(res);
}

export async function createCourse(newCourseDTO: NewCourseDTO): Promise<number> {
    const res = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourseDTO),
    });
    return handleResponse<number>(res);
}

export async function updateCourse(id: number, updateCourseDTO: NewCourseDTO): Promise<void> {
    const res = await fetch(`${BASE_URL}/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateCourseDTO),
    });
    if (!res.ok) throw new Error(await res.text());
}

export async function deleteCourse(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
}
