/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, Link, InputAdornment, IconButton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { apiHelper } from "@/helper/apiHelper";
import { inicioSesionGoogle } from "@/helper/googleHelper";

export default function LoginForm() {
    const [serverError, setServerError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const onSubmit = async (data: any) => {
        setServerError("");

        try {
            const responseData = await apiHelper.login(data);

            const token = responseData.token;

            if (token) {
                sessionStorage.setItem("authToken", token);
            }

            window.location.href = "/";

        } catch (error: any) {
            console.error("Error al iniciar sesión:", error);

            if (error.status === 401) {
                setError("password", { type: "manual", message: "Email o contraseña incorrectos" });
            }
        }
    };

    const handleGoogleSignIn = async () => {
        inicioSesionGoogle();
    };
    
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                minHeight: "70vh",
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2,
                    width: "300px",
                    padding: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "white",
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
                {errors.email && (
                    <Typography variant="body2" color="error">
                        {String(errors.email.message)}
                    </Typography>
                )}

                {/* Campo de Contraseña */}
                <TextField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "La contraseña es obligatoria" })}
                    error={!!errors.password}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Image
                                        src={showPassword ? "/icons/openEye.png" : "/icons/closeEye.png"}
                                        alt={showPassword ? "Ojo abierto" : "Ojo cerrado"}
                                        width={30}
                                        height={30}
                                    />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                {errors.password && (
                    <Typography variant="body2" color="error">
                        {String(errors.password.message)}
                    </Typography>
                )}

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
        </Box>
    );
}
