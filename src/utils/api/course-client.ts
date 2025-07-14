// src/utils/api/course-client.ts

export interface NewModuleDTO {
    // Define fields matching your backend's NewModuleDTO
    // e.g. title: string;
    // description?: string;
}

export interface ModuleDTO {
    id: number;
    // Other module fields matching backend ModuleDTO
}

const BASE_URL = 'http://localhost:8080/api/courses';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
    }
    return res.json() as Promise<T>;
}

export async function getAllModules(courseId: number): Promise<ModuleDTO[]> {
    const res = await fetch(`${BASE_URL}/${courseId}`, { method: 'GET' });
    return handleResponse<ModuleDTO[]>(res);
}

export async function getModuleById(courseId: number, moduleId: number): Promise<ModuleDTO> {
    const res = await fetch(`${BASE_URL}/${courseId}/module/${moduleId}`, { method: 'GET' });
    return handleResponse<ModuleDTO>(res);
}

export async function createModule(courseId: number, newModuleDTO: NewModuleDTO): Promise<number> {
    const res = await fetch(`${BASE_URL}/${courseId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newModuleDTO),
    });
    return handleResponse<number>(res);
}

export async function updateModule(courseId: number, moduleId: number, updateModuleDTO: NewModuleDTO): Promise<void> {
    const res = await fetch(`${BASE_URL}/${courseId}/update/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateModuleDTO),
    });
    if (!res.ok) throw new Error(await res.text());
}

export async function deleteModule(courseId: number, moduleId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${courseId}/${moduleId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
}

export async function enrollUserAsTeacher(courseId: number, userId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${courseId}/addTeacher/${userId}`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
}

export async function enrollUserAsStudent(courseId: number, userId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${courseId}/addStudent/${userId}`, { method: 'POST' });
    if (!res.ok) throw new Error(await res.text());
}
