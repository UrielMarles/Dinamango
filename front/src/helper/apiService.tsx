import { request } from "http";

const API = process.env.NEXT_PUBLIC_API;

interface RequestOptions {
    method: string;
    body?: any;
}

export const apiService = {
    async request(endpoint: string, options: RequestOptions, header: Record<string, string> = {}) {
        try {
            const response = await fetch(`${API}${endpoint}`, {
                method: options.method,
                headers: {
                    "Content-Type": "application/json",
                    ...header,
                },
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData.message);
            }

            return await response.json();

        } catch (error) {
            console.error(`Error en ${options.method} ${endpoint}:`, error);
            throw error;
        }
    },

    // User
    register(data: any) {
        return this.request("/user/register", { method: "POST", body: data });
    },

    login(data: any) {
        return this.request("/user/login", { method: "POST", body: data });
    },

    userValidate() {
        return this.request("/user/validate", { method: "GET" });
    },

    logout(data: any) {
        return this.request("/user/logout", { method: "POST", body: data });
    },

    profilePicture(data: any) {
        return this.request("/user/profile-picture", { method: "POST", body: data });
    },

    // Tareas
    addTareas(data: any) {
        return this.request("/tareas", { method: "POST", body: data });
    },

    getTareas() {
        return this.request("/tareas", { method: "GET" });
    },

    updateTareas(id: number, data: any) {
        return this.request(`/tareas/${id}`, { method: "PUT", body: data });
    },

    deleteTareas(id: number, data: any) {
        return this.request(`/tareas/${id}`, { method: "DELETE", body: data });
    },

    

};