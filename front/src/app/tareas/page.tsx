"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import Link from 'next/link';
import styles from "./tareas.module.css";

import api from '../../jsonPrueba/pruebaApi.json';
interface Publicacion {
    id: number;
    titulo: string;
    dineroOfrecido: number;
    descripcion: string;   
}

interface PublicacionDB {
    id: number;
    titulo: string;
    dineroOfrecido: number;
    descripcion: string;
}

export default function Tareas() {
    // const [publicaciones, setPublicaciones] = useState<PublicacionDB[]>([]);
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    // useEffect(() => {
    //     fetch("http://localhost:5057/api/tareas")
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => setPublicaciones(data))
    //         .catch(error => console.error("Error al obtener publicaciones:", error));
    // }, []);

    useEffect(() => {
        setPublicaciones(api as Publicacion[]);
    }, []);

    return (
        <>
        <h1>Publicar</h1>
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
                            <div key={index}>
                                <h2>{publicacion.titulo}</h2>
                                <p>${publicacion.dineroOfrecido}</p>
                                <br></br>
                                <p>{publicacion.descripcion}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </main>
        </>
    );
}
