"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
    };
    ofertas: any;
}

export default function DetallePublicacion() {
    const params = useParams();
    const id = params.id as string;

    const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
    const [mensajeOferta, setMensajeOferta] = useState<string>("");

    useEffect(() => {
        const tareaConOferta = async (id: string) => {
            try {
                const data = await apiHelper.ObtenerTareaConOfertas(id);

                if (data.id) {
                    setPublicacion(data);
                }
                else {
                    console.warn("No se encontró la tarea con ID:", id);
                }
            }
            catch (err) {
                console.error("Error en la obtencion del id: ", err);
            }
        }

        tareaConOferta(id)
    }, [id]);

    const onSubmit = async () => {
        try {
            const idTarea = params.id as string

            const mensaje = { MensajeOferta: mensajeOferta };

            const responseData = await apiHelper.mandarOferta(idTarea, mensaje)

            return responseData;
        }
        catch (err) {
            console.error("Error al obtener las ofertas: ", err);
        }
    }

    return (
        <>
            <div>
                <h1>{publicacion?.titulo}</h1>
                <p>{publicacion?.descripcion}</p>
                <p>
                    Publicado por: <strong>{publicacion?.creador.nombre} {publicacion?.creador.apellido}</strong>
                </p>
                <p>Cantidad de Ofertas: {publicacion?.ofertas.length}</p>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Escribí tu oferta..."
                    value={mensajeOferta}
                    onChange={(e) => setMensajeOferta(e.target.value)}
                />
                <button onClick={onSubmit}>Ofertar</button>
            </div>
        </>
    );
}
