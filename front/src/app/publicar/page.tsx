import styles from './publicar.module.css';
import Image from 'next/image';

export const metadata = {
    title: 'Publicar tarea',
    description: 'Página para publicar en la aplicación',
  };

export default function Publicar() {
    return (
        <main>
            <h1>Publicar</h1>
            <div className={styles.container}>
                <div className={styles.poster}>
                    <a href="#"></a>
                    <Image
                        src="/gpt_logo.png"
                        alt="Logo de la aplicación"
                        width={200}
                        height={200}
                    />
                    <div className={styles.titulo}>Logo de la aplicación</div>
                </div>
            </div>
        </main>
    );
}

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import styles from "./publicar.module.css";

// export default function Publicar() {
//     const [publicaciones, setPublicaciones] = useState([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await fetch("/api/publicaciones"); // Endpoint con múltiples publicaciones
//                 const data = await response.json();
//                 setPublicaciones(data);
//             } catch (error) {
//                 console.error("Error al obtener los datos:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     if (publicaciones.length === 0) return <p>Cargando...</p>;

//     return (
//         <main>
//             <h1>Publicaciones</h1>
//             <div className={styles.container}>
//                 {publicaciones.map((publicacion, index) => (
//                     <div key={index} className={styles.poster}>
//                         <a href={publicacion.enlace}></a>
//                         <Image
//                             src={publicacion.imagen}
//                             alt={publicacion.descripcion}
//                             width={200}
//                             height={200}
//                         />
//                         <div className={styles.titulo}>{publicacion.descripcion}</div>
//                     </div>
//                 ))}
//             </div>
//         </main>
//     );
// }
