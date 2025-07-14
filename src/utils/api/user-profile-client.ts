// src/utils/api/user-client.ts

export type UserType = 'LDUser' | 'EmployeeUser';

export interface NewUserDTO {
    username: string;
    email: string;
    userType: UserType;
}

export interface UserProfileDTO {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    userType: UserType;
    supabaseUserId: string;
}

const BASE_URL = 'http://localhost:8080/api/users';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    return res.json();
}

// 1. Get all users
export async function getAllUsers(): Promise<UserProfileDTO[]> {
    const res = await fetch(BASE_URL);
    return handleResponse(res);
}

// 2. Create new user (with Authorization header)
export async function createUser(newUser: NewUserDTO, authToken: string): Promise<number> {
    const res = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newUser),
    });
    return handleResponse(res);
}

// 3. Get user by ID
export async function getUserById(id: string): Promise<UserProfileDTO> {
    const res = await fetch(`${BASE_URL}/${id}`);
    return handleResponse(res);
}

// 4. Get user by username
export async function getUserByUsername(username: string): Promise<UserProfileDTO> {
    const res = await fetch(`${BASE_URL}/username/${username}`);
    return handleResponse(res);
}

// 5. Validate list of usernames
export async function validateUsernames(usernames: string[]): Promise<Record<string, boolean>> {
    const res = await fetch(`${BASE_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames }),
    });
    return handleResponse(res);
}

// 6. Search users by usernames
export async function searchUsersByUsernames(usernames: string[]): Promise<UserProfileDTO[]> {
    const res = await fetch(`${BASE_URL}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames }),
    });
    return handleResponse(res);
}
