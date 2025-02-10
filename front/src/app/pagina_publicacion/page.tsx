"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import api from "../../jsonPrueba/pruebaApi.json";

interface Publicacion {
    id: number;
    titulo: string;
    dinero: number;
    descripcion: string;
}

export default function PaginaPublicacion() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [publicacion, setPublicacion] = useState<Publicacion>();

    useEffect(() => {
        if (id) {
            const pub = api.find((item) => item.id === Number(id));
            setPublicacion(pub);
        }
    }, [id]);

    if (!publicacion) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1>{publicacion.titulo}</h1>
            <Image
                src="/gpt_logo.png"
                alt="Imagen de la publicación"
                width={200}
                height={200}
            />
            <p>Precio: ${publicacion.dinero}</p>
            <p>{publicacion.descripcion}</p>
        </div>
    );
}
