"use client";

import React, { useState } from "react";
import { apiHelper } from "@/helper/apiHelper";

const ChatApiTest: React.FC = () => {
    // Estados para los formularios y resultados
    const [usuarioId1, setUsuarioId1] = useState("");
    const [usuarioId2, setUsuarioId2] = useState("");
    const [chatId, setChatId] = useState<number | null>(null);
    const [remitenteId, setRemitenteId] = useState("");
    const [contenido, setContenido] = useState("");
    const [result, setResult] = useState<any>(null);
    const [idUsuario, setIdUsuario] = useState("");
    const [leidoResult, setLeidoResult] = useState<any>(null);

    // Ver que onda la base de datos

    // Crear chat
    const handleCrearChat = async () => {
        try {
            const userIds = [usuarioId1, usuarioId2];

            const response = await apiHelper.crearChat({ UsuarioIds: userIds });

            console.log("Enviando para crear chat con usuarios:", userIds);
            setResult(response);
        }
        catch (error) {
            setResult(error);
        }
    };

    // Listar chats de usuario
    const handleListarChats = async () => {
        try {
            const response = await apiHelper.listarChats(idUsuario);
            setResult(response);
        } catch (e) {
            setResult(e);
        }
    };

    // Obtener chat entre dos usuarios
    const handleObtenerChatEntreUsuarios = async () => {
        try {
            const response = await apiHelper.obtenerChatEntreUsuarios(usuarioId1, usuarioId2);
            setResult(response);
        } catch (e) {
            setResult(e);
        }
    };

    // Enviar mensaje
    const handleEnviarMensaje = async () => {
        try {
            console.log("Preparando para enviar mensaje:", { chatId, remitenteId, contenido });

            const response = await apiHelper.enviarMensaje(Number(chatId), remitenteId, contenido);

            console.log("Enviando mensaje:", { chatId, remitenteId, contenido });

            setResult(response);
        } catch (e) {
            setResult(e);
        }
    };

    // Listar mensajes de un chat
    const handleListarMensajes = async () => {
        try {
            const response = await apiHelper.listarMensajes(Number(chatId));
            setResult(response);
        } catch (e) {
            setResult(e);
        }
    };

    // Marcar mensaje como leído
    const handleMensajeLeido = async () => {
        try {
            const response = await apiHelper.mensajeLeido(Number(chatId), remitenteId);
            setLeidoResult(response);
        } catch (e) {
            setLeidoResult(e);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Test Endpoints de Chat</h2>
            <div style={{ marginBottom: 20 }}>
                <h3>Crear Chat</h3>
                <input placeholder="UsuarioId1" value={usuarioId1} onChange={e => setUsuarioId1(e.target.value)} />
                <input placeholder="UsuarioId2" value={usuarioId2} onChange={e => setUsuarioId2(e.target.value)} />
                <button onClick={handleCrearChat}>Crear Chat</button>
                <p>FUNCIONA!!</p>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3>Listar Chats de Usuario</h3>
                <input placeholder="IdUsuario" value={idUsuario} onChange={e => setIdUsuario(e.target.value)} />
                <button onClick={handleListarChats}>Listar Chats</button>
                <p>FUNCIONA!!</p>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3>Obtener Chat entre dos usuarios</h3>
                <input placeholder="UsuarioId1" value={usuarioId1} onChange={e => setUsuarioId1(e.target.value)} />
                <input placeholder="UsuarioId2" value={usuarioId2} onChange={e => setUsuarioId2(e.target.value)} />
                <button onClick={handleObtenerChatEntreUsuarios}>Obtener Chat</button>
                <p>FUNCIONA!!</p>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3>Enviar Mensaje</h3>
                <input placeholder="ChatId" value={Number(chatId)} onChange={e => setChatId(Number(e.target.value))} />
                <input placeholder="RemitenteId" value={remitenteId} onChange={e => setRemitenteId(e.target.value)} />
                <input placeholder="Contenido" value={contenido} onChange={e => setContenido(e.target.value)} />
                <button onClick={handleEnviarMensaje}>Enviar Mensaje</button>
                <p>FUNCIONA!!</p>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3>Listar Mensajes de un Chat</h3>
                <input placeholder="ChatId" value={Number(chatId)} onChange={e => setChatId(Number(e.target.value))} />
                <button onClick={handleListarMensajes}>Listar Mensajes</button>
                <p>FUNCIONA!!</p>
            </div>
            <div style={{ marginBottom: 20 }}>
                <h3>Marcar Mensaje como Leído</h3>
                <input placeholder="ChatId" value={Number(chatId)} onChange={e => setChatId(Number(e.target.value))} />
                <input placeholder="IdUsuario" value={remitenteId} onChange={e => setRemitenteId(e.target.value)} />
                <button onClick={handleMensajeLeido}>Marcar como Leído</button>
                {leidoResult && <pre>{JSON.stringify(leidoResult, null, 2)}</pre>}
            </div>
            <div>
                <h3>Resultado</h3>
                {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
            </div>
        </div>
    );
};

export default ChatApiTest;
