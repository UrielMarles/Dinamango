"use client";

import { apiHelper } from "@/helper/apiHelper";
import { useEffect, useState } from "react";
import estilos from "./mis_tareas.module.css";

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

interface Ofertas {
    id: string,
    mensajeOferta: string,
    fechaCreacion: Date
    tarea: Tareas
}

function getTareas() {
    return apiHelper.getUserTareas();
}

function getOfertas() {
    return apiHelper.getMisOfertas();
}

export default function MisTareas() {
    const [tareas, setTareas] = useState<Tareas[]>([]);
    const [ofertas, setOfertas] = useState<Ofertas[]>([]);

    useEffect(() => {
        const fetchTareas = async () => {
            try {
                const tareas = await getTareas();

                setTareas(tareas);
            }
            catch (error) {
                console.error("Error al obtener las tareas:", error);
            }
        };
        fetchTareas();

        const fetchOfertas = async () => {
            try {
                const ofertas = await getOfertas();

                setOfertas(ofertas);
            }
            catch (error) {
                console.error("Error al obtener las ofertas:", error);
            }
        }
        fetchOfertas();

    }, []);

    return (
        <>
            <div id={estilos.container}>
                <div id={estilos.tareas}>
                    <h1>Mis Tareas</h1>

                    {tareas.length === 0 ? (
                        <p>No tienes tareas publicadas.</p>
                    ) : (
                        <ul>
                            {tareas.map((tarea) => (
                                <li key={tarea.id}>
                                    <h2>{tarea.titulo}</h2>
                                    <p>{tarea.descripcion}</p>
                                    <p>Ubicación: {tarea.ubicacion}</p>
                                    <p>Fecha deseada: {tarea.fechaDeseada}</p>
                                    <p>Horario deseado: {tarea.horarioDeseado}</p>
                                    <p>Dinero ofrecido: ${tarea.dineroOfrecido}</p>
                                    <p>Ofertas: {tarea.cantidadOfertas ?? "0"}</p>

                                    <button><a href={`../detalles/${tarea.id}`}>Ver la Tarea</a></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div id={estilos.ofertas}>
                    <h1>Mis Ofertas/Postulaciones</h1>

                    {ofertas.length === 0 ? (
                        <p>No has hecho ningua oferta.</p>
                    ) : (
                        <ul>
                            {ofertas.map((oferta) => (
                                <li key={oferta.id}>
                                    <h2>Mensaje de Oferta: {oferta.mensajeOferta}</h2>
                                    <h2>Tarea:</h2>
                                    <ul>
                                        <li>
                                            Titulo: {oferta.tarea.titulo}
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    )
}