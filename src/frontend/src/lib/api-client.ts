const BASE_URL = "/api";

export class ApiError extends Error{
    status: number;

    constructor(status: number, message: string){
        super(message);
        this.status = status;
    }
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(BASE_URL + path, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });

    if(!res.ok){
        let message = res.statusText;
        try{
            const body = await res.json();
            if(body?.message) message = body.message;
        } catch {

        }
        throw new ApiError(res.status, message || `Fejl ${res.status}`);
    }

    if(res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export function sendJson<T>(path: string, method: "POST" | "PUT" | "PATCH", data: unknown){
    return apiClient<T>(path, { method, body: JSON.stringify(data) });
}