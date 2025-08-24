import { Usuario } from "./Usuario";

export interface Publicacion extends Tarea {
    creador: Usuario;
    ofertas: Oferta[];
}