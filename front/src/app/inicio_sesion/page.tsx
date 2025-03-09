/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

const API = process.env.NEXT_PUBLIC_API;

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        // console.log(JSON.stringify(data));

        try {
            const response = await fetch(`${API}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData)
                return;
            }

            const responseData = await response.json();
            const token = responseData.token;

            if (token) {
                sessionStorage.setItem("authToken", token);
                console.log("Token guardado en sessionStorage");
            } else {
                console.error("No se recibió token de autenticación");
            }

            console.log("Inicio de sesion correcta!");

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("Hubo un problema con el registro");
        }
    };

    const handleGoogleSignIn = async () => {
        console.log("Iniciar sesión con Google");
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "300px",
                margin: "auto",
                padding: 3,
                boxShadow: 3,
                borderRadius: 2,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}
        >
            <Typography variant="h5" textAlign="center">Iniciar Sesión</Typography>

            {/* Campo de Email */}
            <TextField
                label="Email"
                type="email"
                {...register("email", { required: "El email es obligatorio" })}
                error={!!errors.email}
                fullWidth
            />

            {/* Campo de Contraseña */}
            <TextField
                label="Contraseña"
                type="password"
                {...register("password", { required: "La contraseña es obligatoria" })}
                error={!!errors.password}
                fullWidth
            />

            {/* Botón de Enviar */}
            <Button type="submit" variant="contained" color="primary" fullWidth>Iniciar Sesión</Button>

            {/* Botón de Iniciar Sesión Google */}
            <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleSignIn}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    textTransform: "none",
                    borderColor: "#ccc",
                }}
                >
                <FcGoogle size={24} />
                Continuar con Google
            </Button>
            
            {/* Si no esta registrado */}
            <Link href="../registro">Registrarse</Link>
        </Box>
    );
}
