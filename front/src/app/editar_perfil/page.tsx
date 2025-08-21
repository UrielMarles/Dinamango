/* eslint-disable */
"use client";

import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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

const editarDatosPerfil = async (data: any) => {
    try {
        const { nombre, apellido, email } = data;

        await apiHelper.updateUser({ nombre, apellido, email, profilePictureURL: "" });

        window.location.href = "./perfil";
    }
    catch (err) {
        console.error("Error al editar perfil:", err);
    }
}

const editarImagen = async (data: any) => {
    try {
        const profilePicture = data.profilePictureURL?.[0];

        await apiHelper.profilePicture(profilePicture);
    }
    catch (err) {
        console.error("Error al editar imagen de perfil:", err);
    }
}

export default function EditarPerfil() {
    const {
        handleSubmit,
        register,
    } = useForm();

    const [profileData, setProfileData] = useState<{
        nombre?: string;
        apellido?: string;
        email?: string;
        profilePictureURL?: string;
        isGoogleUser?: boolean;
    } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getProfile();

            if (data) {
                setProfileData(data);
            }
        };

        fetchProfile();
    }, []);

    const onSubmit = async (data: any) => {
        await editarDatosPerfil(data);

        if (data.profilePictureURL && data.profilePictureURL.length > 0) {
            await editarImagen(data);
        }
    };

    return (
        <>
            <div>
                <h1>Editar perfil</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="nombre">Nombre: </label>
                    <input
                        type="text"
                        id="nombre"
                        {...register("nombre")}
                        defaultValue={profileData?.nombre}
                    />
                </div>

                {!profileData?.isGoogleUser && (
                    <div>
                        <label htmlFor="apellido">Apellido: </label>
                        <input
                            type="text"
                            id="apellido"
                            {...register("apellido")}
                            defaultValue={profileData?.apellido}
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        defaultValue={profileData?.email}
                    />
                </div>

                <div>
                    <input type="file"
                    {...register("profilePictureURL")}
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Guardar cambios
                </Button>
            </form>
        </>
    );
}
