/* eslint-disable */
"use client";

import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import style from "./perfil.module.css";
import { apiHelper } from "@/helper/apiHelper";

const getProfile = async () => {
    try {
        const datosPerfil = await apiHelper.userValidate();

        return datosPerfil;
    }
    catch (err) {
        return null;
    }
}

const getProfilePicture = async (userId: string) => {
    try {
        const img = await apiHelper.getProfilePicture(userId);

        return img;
    }
    catch (error) {
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
        profilePictureUrl?: string;
        role?: string;
        isGoogleUser?: boolean;
    } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfile();
            if (!data) return;

            let profilePictureUrl;

            if (data?.isGoogleUser) {
                profilePictureUrl = data.profilePictureUrl;
            }
            else {
                try {
                    const blob = await getProfilePicture(data.id);
                    profilePictureUrl = blob ? URL.createObjectURL(blob) : undefined;
                }
                catch (error) {
                    console.error("Error al obtener la imagen de perfil:", error);
                }
            }

            setProfileData({
                ...data,
                profilePictureUrl
            });
        };

        fetchProfile();
    }, []);

    const cerrarSesion = async () => {
        try {
            await apiHelper.logout();

            sessionStorage.removeItem("authToken");

            window.location.href = "./inicio_sesion";

        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <>
            <div>
                <h1>Mi perfil</h1>
            </div>

            <div>
                {profileData?.profilePictureUrl ? <img src={profileData?.profilePictureUrl} alt="Imagen Usuario" className={style.imgPerfil} /> : <img src="/icons/user.png" alt="Imagen Usuario" className={style.imgPerfil} />}

                <h3>Email: {profileData?.email}</h3>
                {profileData?.isGoogleUser ? <h3>Nombre: {profileData?.nombre}</h3> : <h3>Nombre: {profileData?.nombre} {profileData?.apellido}</h3>}
                {profileData?.role === "admin" ? <h3>Rol: Administrador</h3> : ""}
            </div>

            <div>
                <Button
                    onClick={() => window.location.href = "../editar_perfil"}
                    variant="contained"
                    color="warning"
                    sx={{
                        width: "100px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    Editar
                </Button>
            </div>

            <div>
                <Button
                    onClick={handleSubmit(cerrarSesion)}
                    variant="contained"
                    color="primary"
                    sx={{
                        width: "100px",
                        height: "30px",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                    }}
                >
                    Logout
                </Button>
            </div>
        </>
    );
}