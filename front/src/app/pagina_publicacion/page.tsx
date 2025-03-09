"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import api from "../../jsonPrueba/pruebaApi.json";

interface Publicacion {
    id: number;
    titulo: string;
    dineroOfrecido: number;
    descripcion: string;
}

function ContenidoPaginaPublicacion() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [publicacion, setPublicacion] = useState<Publicacion | null>(null);

    useEffect(() => {
        if (id) {
            const pub = api.find((item) => item.id === Number(id));
            setPublicacion(pub || null);
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
            <p>Precio: ${publicacion.dineroOfrecido}</p>
            <p>{publicacion.descripcion}</p>
        </div>
    );
}

export default function PaginaPublicacion() {
    return (
        <Suspense fallback={<div>Cargando página...</div>}>
            <ContenidoPaginaPublicacion />
        </Suspense>
    );
}
