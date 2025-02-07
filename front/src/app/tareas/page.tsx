"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./tareas.module.css";

export default function Tareas() {
    // const [publicaciones, setPublicaciones] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch("/api/publicaciones"); // Endpoint con múltiples publicaciones
    //             const data = await response.json();
    //             setPublicaciones(data);
    //         } catch (error) {
    //             console.error("Error al obtener los datos:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // return (
    //     <main>
    //         <h1>Publicaciones</h1>
    //         <div className={styles.container}>
    //             {publicaciones.map((publicacion, index) => (
    //                 <div key={index} className={styles.poster}>
    //                     <a href={publicacion.enlace}></a>
    //                     <Image
    //                         src={publicacion.imagen}
    //                         alt={publicacion.descripcion}
    //                         width={200}
    //                         height={200}
    //                     />
    //                     <div className={styles.titulo}>{publicacion.descripcion}</div>
    //                 </div>
    //             ))}
    //         </div>
    //     </main>
    // );

    return (
        <>
        <h1>Publicar</h1>
        <main>
            <div className={styles.container}>
                <a href="#">
                    <div className={styles.poster}>
                        <Image
                            src="/gpt_logo.png"
                            alt="Logo de la aplicación"
                            width={200}
                            height={200}
                        />
                        <div className={styles.titulo}>Logo de la aplicación</div>
                    </div>
                </a>
            </div>
            <div className={styles.container}>
                <a href="#">
                    <div className={styles.poster}>
                        <Image
                            src="/gpt_logo.png"
                            alt="Logo de la aplicación"
                            width={200}
                            height={200}
                        />
                        <div className={styles.titulo}>Logo de la aplicación</div>
                    </div>
                </a>
            </div>
            <div className={styles.container}>
                <a href="#">
                    <div className={styles.poster}>
                        <Image
                            src="/gpt_logo.png"
                            alt="Logo de la aplicación"
                            width={200}
                            height={200}
                        />
                        <div className={styles.titulo}>Logo de la aplicación</div>
                    </div>
                </a>
            </div>
        </main>
        </>
    );
}


