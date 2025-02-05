/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";

export default function RegistroForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data: any) => {
        console.log("Datos enviados:", data);
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
                borderRadius: 2
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

            {/* Campo de Apellido */}
            <TextField
                label="Apellido"
                type="text"
                {...register("apellido", { required: "El apellido es obligatorio" })}
                error={!!errors.apellido}
                fullWidth
            />

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

             {/* Repetir Campo de Contraseña */}
             <TextField
                label="Repetir Contraseña"
                type="password"
                {...register("password", { required: "Las contraseñas deben ser iguales" })}
                error={!!errors.password}
                fullWidth
            />

            {/* Botón de Enviar */}
            <Button type="submit" variant="contained" color="primary" fullWidth>Registrarse</Button>

            {/* Si ya esta registrado */}
            <Link href="../inicio_sesion">Iniciar Sesión</Link>
        </Box>
    );
}
