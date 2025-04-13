"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiHelper } from "@/helper/apiHelper";

interface Publicacion {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    horarioDeseado: string;
    fechaDeseada: string;
    dineroOfrecido: number;
    creador: {
        id: string;
        nombre: string;
        apellido: string;
        email: string;
    };
    cantidadOfertas: number;
}

export default function DetallePublicacion() {
    const params = useParams();
    const id = params.id as string;

    const [publicacion, setPublicacion] = useState<Publicacion | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getTareaPorId = async (id: string) => {
                    const tareas: Publicacion[] = await apiHelper.getTareas();

                    return tareas.find(t => t.id === id);
                };

                const tarea = await getTareaPorId(id);
                if (tarea) {
                    setPublicacion(tarea);
                } else {
                    console.warn("No se encontró la tarea con ID:", id);
                }

            } catch (error) {
                console.error("Error al obtener los detalles:", error);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            <h1>{publicacion?.titulo}</h1>
            <p>{publicacion?.descripcion}</p>
            <p>Publicado por: <strong>{publicacion?.creador.nombre} {publicacion?.creador.apellido}</strong></p>
            <p>Ofertantes: {publicacion?.cantidadOfertas}</p>
        </div>
    );
}
