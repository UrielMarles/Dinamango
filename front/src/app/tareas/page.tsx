"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
// import Link from 'next/link';
import styles from "./tareas.module.css";

import api from '../../jsonPrueba/pruebaApi.json';
interface Publicacion {
    id: number;
    titulo: string;
    dinero: number;
    descripcion: string;
}

export default function Tareas() {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);

    useEffect(() => {
        setPublicaciones(api as Publicacion[]);
    }, []);

    return (
        <>
        <h1>Publicar</h1>
        <main>
            {publicaciones.map((publicacion, index) => (
                <div key={index} className={styles.container}>
                    <a href={`./pagina_publicacion?id=${publicacion.id}`}>
                        <div className={styles.poster}>
                            <Image
                                src="/gpt_logo.png"
                                alt="Logo de la aplicación"
                                width={200}
                                height={200}
                            />
                            <div className={styles.titulo}>
                                <div key={index}>
                                    <h2 className={styles.tituloPublicacion}>{publicacion.titulo}</h2>
                                    <p>${publicacion.dinero}</p>
                                    <br></br>
                                    <p>{publicacion.descripcion}</p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            ))};
        </main>
        </>
    );
}
