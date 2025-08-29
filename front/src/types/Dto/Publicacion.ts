import { Usuario } from "./Usuario";
import { Tarea } from "./Tarea";
import { Oferta } from "./Oferta";

export interface Publicacion extends Tarea {
    creador: Usuario;
    ofertas: Oferta[];
}