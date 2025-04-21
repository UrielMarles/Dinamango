const API = process.env.NEXT_PUBLIC_API;

interface RequestOptions {
    method: string;
    body?: any;
    headers?: Record<string, string>;
    includeToken?: boolean;
}

export const apiHelper = {
    async request(endpoint: string, options: RequestOptions) {
        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            };

            if (options.includeToken) {
                const token = sessionStorage.getItem("authToken");

                if (token) {
                    headers.Authorization = token;
                }
            }

            const response = await fetch(`${API}${endpoint}`, {
                method: options.method,
                headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw { status: response.status, message: responseData.message || "Error desconocido" };
            }

            return responseData

        } catch (error) {
            console.error(`Error en ${options.method} ${endpoint}:`, error); // Borrar despues
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

    googleLogin(data: any) {
        return this.request("/user/login/google", { method: "POST", body: data });
    },

    userValidate() {
        return this.request("/user/validate", { method: "GET", includeToken: true });
    },

    logout(data: any) {
        return this.request("/user/logout", { method: "POST", body: data, includeToken: true });
    },

    profilePicture(data: any) {
        return this.request("/user/profile-picture", { method: "POST", body: data, includeToken: true });
    },

    // Tareas
    getTareas() {
        return this.request("/tareas", { method: "GET" });
    },

    getUserTareas() {
        return this.request(`/tareas/user`, { method: "GET", includeToken: true });
    },

    ObtenerTareaConOfertas(idTarea: string) {
        return this.request(`/tareas/${idTarea}/ofertas`, {method: "GET", includeToken: true});
    },

    addTareas(data: any) {
        return this.request("/tareas", { method: "POST", body: data, includeToken: true });
    },

    updateTareas(id: number, data: any) {
        return this.request(`/tareas/${id}`, { method: "PUT", body: data, includeToken: true });
    },

    deleteTareas(id: number) {
        return this.request(`/tareas/${id}`, { method: "DELETE", includeToken: true });
    },

    // Ofertas
    /**
     * @param id id Publicidad
     */
    mandarOferta(id: string, data: any) {
        return this.request(`/ofertas/${id}`, { method: "POST", body: data, includeToken: true });
    },

    /**
     * @param id id Tarea
     */
    getOfertas(id: number) {
        return this.request(`/ofertas/${id}`, { method: "GET" });
    }

};
