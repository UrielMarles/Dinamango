"use client";

import { useState, useEffect } from "react";
import styles from "./tareas.module.css";
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
        isGoogleUser: boolean;
        profilePictureUrl: string;
    };
    ofertas: any;
}

function getImage(id: string) {
    return apiHelper.getProfilePicture(id);
}

export default function Tareas() {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
            const data = await apiHelper.getTareas();

            if (!data) return;

            const publicacionesActualizadas = await Promise.all(
                data.map(async (pub: Publicacion) => {
                    let profilePictureUrl = pub.creador.profilePictureUrl;

                    if (!pub.creador.isGoogleUser) {
                        try {
                            const blob = await getImage(pub.creador.id);
                            profilePictureUrl = blob ? URL.createObjectURL(blob) : " ";
                        } catch (e) {
                            profilePictureUrl = " ";
                        }
                    }

                    return {
                        ...pub,
                        creador: {
                            ...pub.creador,
                            profilePictureUrl,
                        },
                    };
                })
            );

            setPublicaciones(publicacionesActualizadas);
            }
            catch (error) {
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
                            <img id={styles.logoCreador} src={publicacion.creador.profilePictureUrl} alt="Logo del Creador" />
                            <div className={styles.titulo}>
                                <p>Titulo: {publicacion.titulo}</p>
                                <p>Descripcion: {publicacion.descripcion}</p>
                                <p>Ubicacion: {publicacion.ubicacion}</p>
                                <p>Horario Deseado: {publicacion.horarioDeseado}</p>
                                <p>Fecha Desesada: {publicacion.fechaDeseada}</p>
                                <p>Dinero Ofrecido: {publicacion.dineroOfrecido}</p>
                            </div>

                            <a href={`../detalles/${publicacion.id}`} className={styles.btn}>Postularme</a>
                        </div>
                    </div>
                ))}
            </main>
        </>
    );
}
