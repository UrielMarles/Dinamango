"use client"; // Necesario para que funcione en Next.js App Router

import { TextField, Button, Box, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

export default function LoginForm() {
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Enviar
      </Button>
    </Box>
  );
}
