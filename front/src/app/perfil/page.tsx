/* eslint-disable */
"use client";

import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import style from "./perfil.module.css";
import { apiHelper } from "@/helper/apiHelper";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/helper/firebaseConfig";

const getProfile = async () => {
    try {
        const datosPerfil = await apiHelper.userValidate();

        return datosPerfil;
    }
    catch (err) {
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

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

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

    const onSubmit = async (data: any) => {
        try {
            sessionStorage.removeItem("authToken");

            if (user) {
                await signOut(auth);

                window.location.href = "./inicio_sesion";

                return;
            }

            await apiHelper.logout(data);

            window.location.href = "./inicio_sesion";

        } catch (error: any) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    return (
        <>
            <div>
                <h1>Mi perfil</h1>
            </div>

            <div>
                {user?.photoURL ? <img src={user?.photoURL} alt="Imagen Usuario" className={style.imgPerfil} /> : ""}
                {profileData?.email ? <h3>Email: {profileData?.email}</h3> : <h3>Email: {user?.email}</h3>}
                {profileData?.nombre ? <h3>Nombre: {profileData?.nombre} {profileData?.apellido}</h3> : <h3>Nombre: {user?.displayName}</h3>}
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