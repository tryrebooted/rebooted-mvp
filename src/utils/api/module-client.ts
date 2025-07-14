// src/utils/api/module-client.ts

export interface ContentDTO {
    id: number;
    // other content fields here
}

export interface NewContentDTO {
    // fields common to content update
}

export interface NewQuestionContentDTO extends NewContentDTO {
    // fields specific to question content
}

export interface NewTextContentDTO extends NewContentDTO {
    // fields specific to text content
}

const BASE_URL = 'http://localhost:8080/api/modules';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
    }
    return res.json() as Promise<T>;
}

export async function getAllContents(moduleId: number): Promise<ContentDTO[]> {
    const res = await fetch(`${BASE_URL}/${moduleId}`, { method: 'GET' });
    return handleResponse<ContentDTO[]>(res);
}

export async function getContentById(moduleId: number, contentId: number): Promise<ContentDTO> {
    const res = await fetch(`${BASE_URL}/${moduleId}/content/${contentId}`, { method: 'GET' });
    return handleResponse<ContentDTO>(res);
}

export async function createQuestionContent(moduleId: number, newContent: NewQuestionContentDTO): Promise<number> {
    const res = await fetch(`${BASE_URL}/${moduleId}/addQuestion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
    });
    return handleResponse<number>(res);
}

export async function createTextContent(moduleId: number, newContent: NewTextContentDTO): Promise<number> {
    const res = await fetch(`${BASE_URL}/${moduleId}/addText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent),
    });
    return handleResponse<number>(res);
}

export async function updateContent(moduleId: number, contentId: number, updateContent: NewContentDTO): Promise<void> {
    const res = await fetch(`${BASE_URL}/${moduleId}/update/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateContent),
    });
    if (!res.ok) throw new Error(await res.text());
}

export async function deleteContent(moduleId: number, contentId: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/${moduleId}/${contentId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
}
