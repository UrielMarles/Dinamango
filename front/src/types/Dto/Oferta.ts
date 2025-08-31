import { Tarea } from "./Tarea";
import { Usuario } from "./Usuario";

export interface Oferta {
    id: string;
    mensajeOferta: string;
    fechaCreacion: Date;
    tarea: Tarea;
    postulante?: Usuario
}