import { request } from "http";

const API = process.env.NEXT_PUBLIC_API;

interface RequestOptions {
    method: string;
    body?: any;
}

export const apiService = {
    async request(endpoint: string, options: RequestOptions) {
        try {
            const response = await fetch(`${API}${endpoint}`, {
                method: options.method,
                headers: {
                    "Content-Type": "application/json",
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

    login(data: any) {
        return this.request("/user/login", { method: "POST", body: data });
    },

    register(data: any) {
        return this.request("/user/register", { method: "POST", body: data });
    }
};