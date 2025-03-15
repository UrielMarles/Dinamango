/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, ToggleButton, ToggleButtonGroup, Link, InputAdornment } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function TareasForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [value, setValue] = useState("");

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string) => {
        if (newValue !== null) {
            setValue(newValue);
        }
    }

    return (
        <>
            <div>
                <h2>Publicar Tarea</h2>
            </div>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 2,
                        width: "500px",
                        padding: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: "white",
                    }}
                >

                    {/* TITULO Y FECHA */}
                    {/* <Typography>Empecemos con lo básico.</Typography>
                    <br />

                    <Typography>En pocas palabras ¿Qué necesitas que se haga?</Typography>

                    <TextField
                        placeholder="Ejemplo: Pintar mi casa"
                        type="text"
                        {...register("titulo", { required: "El titulo es obligatorio" })}
                    />
                    <br />

                    <Typography>¿Cuándo necesitas que se haga esto?</Typography>

                    <ToggleButtonGroup
                        value={value}
                        exclusive
                        onChange={handleChange}
                        aria-label="Seleccionar fecha"
                    >
                        <ToggleButton value="fecha">En la fecha</ToggleButton>
                        <ToggleButton value="antes">Antes de la fecha</ToggleButton>
                        <ToggleButton value="flexible">Soy flexible</ToggleButton>
                    </ToggleButtonGroup> */}

                    {/* UBICACION */}
                    {/* <Typography>Dinos dónde</Typography>
                    <br />

                    <Typography>¿Es esta una tarea de mudanza?</Typography>
                    <Button>Si</Button>
                    <Button>No</Button> */}

                    {/* DETALLES */}
                    {/* <Typography>Proporcionar más detalles</Typography>
                    <br />

                    <Typography>¿Cuáles son los detalles?</Typography>
                    <TextField
                        placeholder="Escribe un resumen de los detalles clave"
                        multiline
                        minRows={4}
                        maxRows={6}
                        {...register("descripcion", { required: "La descripcion es obligatoria" })}

                    />

                    <Typography>Añadir imágenes <span>(opcional)</span></Typography>
                    <TextField
                        type="file"
                        {...register("imagenes")}    
                    /> */}


                    {/* PRESUPUESTO */}
                    {/* <Typography>Sugiera su presupuesto</Typography>
                    <br />

                    <Typography>¿Cuál es tu presupuesto?</Typography>
                    <Typography>Siempre puedes negociar el precio final.</Typography>
                    <TextField
                        fullWidth
                        placeholder="Introducir presupuesto"
                        type="number"
                        {...register("dineroOfrecido", { required: "El dinero ofrecido es obligatorio" })}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Image
                                        src="/icons/dolar.png"
                                        alt="Moneda"
                                        width={25}
                                        height={25}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    /> */}

                    <Button type="submit" variant="contained" color="primary">Siguiente</Button>
                    {/* <Button type="submit" variant="contained" color="primary">Atrás</Button> */}

                </Box>
            </Box>
        </>
    );
}
