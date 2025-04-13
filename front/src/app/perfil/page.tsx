/* eslint-disable */
"use client";

import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { apiHelper } from "@/helper/apiHelper";
import { useSession, signOut } from "next-auth/react";

const token = sessionStorage.getItem("authToken");

const getProfile = async () => {
    try {
        if (!token) {
            return null;
        }

        const datosPerfil = await apiHelper.userValidate(token);

        if (!datosPerfil) {
            return null;
        }
        else {
            return datosPerfil;
        }
    }
    catch (err) {
        return null;
    }
}

export default function Perfil() {
    const { data: session } = useSession();

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

            if (!data) {
                return null;
            }
            else {
                setProfileData(data);
            }
        };

        fetchProfile();
    }, []);

    const onSubmit = (data: any) => {
        try {
            sessionStorage.removeItem("authToken");

            apiHelper.logout(data);

            if (session?.user?.email) {
                signOut( { callbackUrl: "./inicio_sesion" } );
            }

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
                {profileData?.email ? <h3>Email: {profileData?.email}</h3> : <h3>Email: {session?.user?.email}</h3>}
                {profileData?.nombre ? <h3>Nombre: {profileData?.nombre} {profileData?.apellido}</h3> : <h3>Nombre: {session?.user?.name}</h3>}
                {profileData?.role === "admin" ? <h3>Rol: Administrador</h3> : ""}
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