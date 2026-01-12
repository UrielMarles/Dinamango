"use client";

import { apiHelper } from "@/helper/apiHelper";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import style from "./chat.module.css";

export default function chat() {
    const params = useParams();
    const id1 = params.id1 as string;
    const id2 = params.id2 as string;

    const [chatId, setChatId] = useState<number | null>(null);
    const [remitenteId, setRemitenteId] = useState("");
    const [contenido, setContenido] = useState("");
    const [result, setResult] = useState<{ mensajes: any[] } | null>(null);
    // const [leidoResult, setLeidoResult] = useState<any>(null);

    const myUser = async () => {
        try {
            const data = await apiHelper.userValidate();

            if (data.id) {
                setRemitenteId(data.id);
            }
            else {
                return null
            }
        }
        catch (err) {
            console.error("Error en los datos del usuario", err);
        }
    }

    const handleObtenerChat = async () => {
        try {
            const data = await apiHelper.obtenerChatEntreUsuarios(id1, id2);

            setResult(data);
            setChatId(data.chatId);
        }
        catch (err) {
            console.error("Error al obtener el chat", err);
        }
    };

    const handleEnviarMensaje = async () => {
        try {
            const response = await apiHelper.enviarMensaje(Number(chatId), remitenteId, contenido);

            setContenido("");
            setResult(response);

            await handleObtenerChat();
        }
        catch (err) {
            setResult(err as any);
        }
    }

    useEffect(() => {
        myUser();
        handleObtenerChat();
    }, [id1, id2]);

    return (
        <>
            <h1>Chat</h1>
            <div className={style.chatContainer}>
                <div className={style.mensajeContainer}>
                    {result?.mensajes?.length === 0 ? (
                        <p>Comenzar conversación</p>
                    ) : (
                        result?.mensajes?.map((mensaje: any, index: number) => (
                            <div key={index}>
                                {mensaje.remitenteId === remitenteId ? (
                                    <p className={style.miMensaje}>{mensaje.contenido}</p>
                                ) : (<p className={style.otroMensaje}>{mensaje.contenido}</p>)}
                            </div>
                        ))
                    )}
                </div>

                <div>
                    <input
                        placeholder="Escribir mensaje..."
                        className={style.inputMensaje}
                        value={contenido}
                        onChange={e => setContenido(e.target.value)}
                    />
                    <button onClick={handleEnviarMensaje}>Enviar</button>
                </div>
            </div>
        </>
    );
}
