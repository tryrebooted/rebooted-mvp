// src/utils/api/content-client.ts

export interface ContentDTO {
    id: number;
    title: string;
    description: string;
    moduleId: number;
    completed: boolean;
    // Add other fields as needed
}

export interface NewContentDTO {
    title: string;
    description: string;
    moduleId: number;
    // Add other fields as needed
}

const BASE_URL = 'http://localhost:8080/api/content';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    return res.json();
}

// Get all content
export async function getAllContent(): Promise<ContentDTO[]> {
    const res = await fetch(BASE_URL);
    return handleResponse<ContentDTO[]>(res);
}

// Get content by ID
export async function getContentById(id: number): Promise<ContentDTO> {
    const res = await fetch(`${BASE_URL}/${id}`);
    return handleResponse<ContentDTO>(res);
}

// Get all content for a specific module
export async function getContentByModuleId(moduleId: number): Promise<ContentDTO[]> {
    const res = await fetch(`${BASE_URL}/module/${moduleId}`);
    return handleResponse<ContentDTO[]>(res);
}

// Create new content
export async function createContent(newContent: NewContentDTO): Promise<ContentDTO> {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
    });
    return handleResponse<ContentDTO>(res);
}

// Update existing content
export async function updateContent(id: number, updatedContent: NewContentDTO): Promise<ContentDTO> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContent),
    });
    return handleResponse<ContentDTO>(res);
}

// Delete content
export async function deleteContent(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error(await res.text());
}

// Mark content as complete
export async function markContentComplete(id: number): Promise<ContentDTO> {
    const res = await fetch(`${BASE_URL}/${id}/complete`, {
        method: 'POST',
    });
    return handleResponse<ContentDTO>(res);
}

// Mark content as incomplete
export async function markContentIncomplete(id: number): Promise<ContentDTO> {
    const res = await fetch(`${BASE_URL}/${id}/incomplete`, {
        method: 'POST',
    });
    return handleResponse<ContentDTO>(res);
}
