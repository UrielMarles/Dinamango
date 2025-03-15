"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import styles from "./tareas.module.css";
import { apiService } from "@/helper/apiService";

interface Publicacion {
    titulo: string;
    descripcion: string;
    ubicacion: string;
    horarioDeseado: string;
    fechaDeseada: string;
    dineroOfrecido: number;
}

export default function Tareas() {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: Publicacion[] = await apiService.getTareas();
                setPublicaciones(data);
                
            } catch (error) {
                console.error("Error al obtener publicaciones:", error);
            }
        };
    
        fetchData();
    }, []);

    return (
        <>
        <h1>Ver Tareas</h1>
        <main>
            {publicaciones.map((publicacion, index) => (
                <div key={index} className={styles.container}>
                    <div className={styles.poster}>
                        <Image
                            src="/gpt_logo.png"
                            alt="Logo de la aplicación"
                            width={200}
                            height={200}
                        />
                        <div className={styles.titulo}>
                            <div>
                                <p>Titulo: {publicacion.titulo}</p>
                                <p>Descripcion: {publicacion.descripcion}</p>
                                <p>Ubicacion: {publicacion.ubicacion}</p>
                                <p>Horario Deseado: {publicacion.horarioDeseado}</p>
                                <p>Fecha Desesada: {publicacion.fechaDeseada}</p>
                                <p>Dinero Ofrecido: {publicacion.dineroOfrecido}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
        </>
    );
}
