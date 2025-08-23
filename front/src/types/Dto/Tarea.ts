interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    fechaDeseada: string;
    horarioDeseado: string;
    dineroOfrecido: number;
    cantidadOfertas: number;
    estado?: 'terminada' | 'buscando_ofertas' | 'en_progreso';
}