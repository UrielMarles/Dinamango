"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiHelper } from "@/helper/apiHelper";
import toast from "react-hot-toast";
import { Publicacion } from "@/types/Dto/Publicacion";
import { Oferta } from "@/types/Dto/Oferta";

async function dataUser() {
    try {
        const data = await apiHelper.userValidate();

        if (data.id) {
            return data.id;
        }
        else {
            return null
        }
    }
    catch (error) {
        console.error("Error en los datos del usuario", error);
    }
}

export default function DetallePublicacion() { // Bug/error sin iniciar sesion no poder entrar
    const params = useParams();
    const id = params.id as string;

    const [userId, setUserId] = useState<string | null>(null);
    const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [mensajeOferta, setMensajeOferta] = useState<string>("");

    const tareaConOferta = async (id: string) => {
        try {
            const data = await apiHelper.ObtenerTareaConOfertas(id);

            if (data.id) {
                setPublicacion(data);
            }
        }
        catch (err) {
            console.error("Error en la obtencion del id: ", err);
        }
    }

    useEffect(() => {
        tareaConOferta(id);

        async function fetchUserId() {
            const userId = await dataUser();

            setUserId(userId);
        }
        fetchUserId();

        async function fetchOfertas() {
            const postulaciones = await apiHelper.GetPostulacionesEnMisTareas();
            const filtradas = postulaciones.filter((p: Oferta) => p.tarea?.id === id);

            setOfertas(filtradas);
        }
        fetchOfertas();

    }, [id]);

    const onSubmit = async () => {
        try {
            const idTarea = params.id as string

            const mensaje = { MensajeOferta: mensajeOferta };

            const responseData = await apiHelper.mandarOferta(idTarea, mensaje)

            toast.success("Postulación enviada con éxito.");

            setMensajeOferta("");

            await tareaConOferta(idTarea);

            return responseData;
        }
        catch (err) {
            console.error("Error al obtener las ofertas: ", err);

            toast.error("Hubo un problema con la postulación.");
        }
    }

    return (
        <>
            <div>
                <h1>{publicacion?.titulo}</h1>
                <p>{publicacion?.descripcion}</p>
                <p>
                    Publicado por: {publicacion?.creador.id === userId ? publicacion.creador.nombre : `${publicacion?.creador.nombre} ${publicacion?.creador.apellido}`}
                </p>
                <p>Cantidad de Ofertas: <span>{publicacion?.ofertas.length}</span></p>
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

            <div>
                {publicacion?.creador.id === userId ? (
                    <div>
                        {ofertas.map((oferta) => (
                            <div key={oferta.id}>
                                <h2>Postulante: {oferta.postulante?.isGoogleUser ? oferta.postulante?.nombre : `${oferta.postulante?.nombre} ${oferta.postulante?.apellido}`}</h2>
                                <p>Mensaje: {oferta.mensajeOferta}</p>
                                <button>Rechazar</button>
                                {/* Agregar logica para aceptar o rechazar*/}
                                <button>Aceptar</button>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
}
