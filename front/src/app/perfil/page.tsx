/* eslint-disable */
"use client";

import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { apiHelper } from "@/helper/apiHelper";

const token = sessionStorage.getItem("authToken");

const getProfile = async () => {
    try {
        const datosPerfil = await apiHelper.userValidate(token);

        return datosPerfil;

    } catch (error: any) {
        console.error("Error al obtener perfil:", error);

        return null;
    }
}

export default function Perfil() {
    const {
        handleSubmit,
    } = useForm();

    const [profileData, setProfileData] = useState<{
        id?: string;
        nombre?: string;
        apellido?: string;
        email?: string;
        role?: string;
    } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfile();

            setProfileData(data);
        };

        fetchProfile();
    }, []);

    const onSubmit = (data: any) => {
        try {
            apiHelper.logout(data);

            sessionStorage.removeItem("authToken");

            window.location.href = "./inicio_sesion";

        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <>
            <div>
                <h1>Perfil</h1>
            </div>

            <div>
                <h3>Email: {profileData?.email}</h3>
                <h3>Nombre: {profileData?.nombre}</h3>
                <h3>Apellido: {profileData?.apellido}</h3>
                {profileData?.role === "admin" ? <h3>Rol: Administrador</h3>: ""}
            </div>

            <div>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="primary"
                    sx={{
                        width: "100px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    Logout
                </Button>
            </div>
        </>
    );
}