import { Usuario } from "./Usuario";

export interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    horarioDeseado: string;
    fechaDeseada: string;
    dineroOfrecido: number;
    fechaPublicacion: string;
    cantidadOfertas: number;
    estado?: 'terminada' | 'buscando_ofertas' | 'en_progreso';
}