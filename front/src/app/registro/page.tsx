/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { apiService } from "@/helper/apiService";

export default function RegistroForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data: any) => {
        try {
            await apiService.register(data);

            window.location.href = "./inicio_sesion";

        } catch (error) {
            console.log("Hubo un problema con el registro");
        }
    };

    const handleGoogleSignIn = async () => {
        console.log("Registrarse con Google");
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                minHeight: "80vh",
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
                <Typography variant="h5" textAlign="center">Registro</Typography>

                {/* Campo de Nombre */}
                <TextField
                    label="Nombre"
                    type="text"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    error={!!errors.nombre}
                    fullWidth
                />
                {errors.nombre && (
                    <Typography variant="body2" color="error">
                        {String(errors.nombre.message)}
                    </Typography>
                )}

                {/* Campo de Apellido */}
                <TextField
                    label="Apellido"
                    type="text"
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                    error={!!errors.apellido}
                    fullWidth
                />
                {errors.apellido && (
                    <Typography variant="body2" color="error">
                        {String(errors.apellido.message)}
                    </Typography>
                )}

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
                    type="password"
                    {...register("password", { required: "La contraseña es obligatoria" })}
                    error={!!errors.password}
                    fullWidth
                />
                {errors.password && (
                    <Typography variant="body2" color="error">
                        {String(errors.password.message)}
                    </Typography>
                )}

                {/* Repetir Campo de Contraseña */}
                <TextField
                    label="Repetir Contraseña"
                    type="password"
                    {...register("repeatPassword", { 
                        required: "Debes repetir la contraseña",
                        validate: value => value === watch("password") || "Las contraseñas no coinciden"
                    })}
                    error={!!errors.repeatPassword}
                    fullWidth
                />
                {errors.repeatPassword && (
                    <Typography variant="body2" color="error">
                        {String(errors.repeatPassword.message)}
                    </Typography>
                )}

                {/* Botón de Enviar */}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Registrarse
                </Button>

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

                {/* Si ya está registrado */}
                <Link href="../inicio_sesion">Iniciar Sesión</Link>
            </Box>
        </Box>
    );
}