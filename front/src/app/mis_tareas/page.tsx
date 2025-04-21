"use client";

import { apiHelper } from "@/helper/apiHelper";
import { useEffect, useState } from "react";

interface Tareas {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    fechaDeseada: string;
    horarioDeseado: string;
    dineroOfrecido: number;
    cantidadOfertas: number;
}

function getTareas() {
    return apiHelper.getUserTareas();
}

export default function MisTareas() {
    const [tareas, setTareas] = useState<Tareas[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tareas = await getTareas();
                
                setTareas(tareas);
            }
            catch (error) {
                console.error("Error al obtener las tareas:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>Mis Tareas</h1>

            <div>
                {tareas.length === 0 ? (
                    <p>No tienes tareas publicadas.</p>
                ) : (
                    <ul>
                        {tareas.map((tarea) => (
                            <li key={tarea.id}>
                                <h2>{tarea?.titulo}</h2>
                                <p>{tarea?.descripcion}</p>
                                <p>Ubicación: {tarea?.ubicacion}</p>
                                <p>Fecha deseada: {tarea?.fechaDeseada}</p>
                                <p>Horario deseado: {tarea?.horarioDeseado}</p>
                                <p>Dinero ofrecido: ${tarea?.dineroOfrecido}</p>
                                <p>Ofertas: {tarea?.cantidadOfertas ?? "0"}</p>

                                {/* <button onClick={mostrarOfertas()}>Ver ofertas</button> */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    ) 
}