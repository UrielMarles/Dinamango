/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, InputAdornment } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiHelper } from "@/helper/apiHelper";

export default function TareasForm() {
    const sectionsFields = [
        { titulo: true, fechaDeseada: true, horarioDeseado: true },
        { ubicacionTipo: true, ubicacion: true },
        { descripcion: true },
        { dineroOfrecido: true }
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger
    } = useForm();

    const [fechaSeleccionada, setValueFecha] = useState("");
    const [horaSeleccionada, setValueHora] = useState("");
    const [currentSection, setCurrentSection] = useState(0);
    const [ubicacionTipo, setUbicacionTipo] = useState<null | string>(null);

    const handleChangeFecha = (newValue: string) => {
        setValueFecha(newValue);
        setValue("fechaDeseada", newValue, { shouldValidate: true });
        trigger("fechaDeseada");
    };

    const handleChangeHorario = (newValue: string) => {
        setValueHora(newValue);
        setValue("horarioDeseado", newValue, { shouldValidate: true });
        trigger("horarioDeseado");
    }

    const onSubmit = async (data: any) => {
        const { ubicacionTipo, ...cleanData } = data;

        if (ubicacionTipo === "online") {
            cleanData.ubicacion = "online";
        }

        try {
            await apiHelper.addTareas(cleanData);

        } catch (error) {
            console.error("Hubo un error con agregar una tarea", error);
        }

        window.location.reload();
    };

    const handleNext = async () => {
        const sectionFields = Object.keys(sectionsFields[currentSection]);

        if (currentSection === 0 && !fechaSeleccionada) {
            setValue("fechaDeseada", "");
            trigger("fechaDeseada");

            return;
        }

        if (currentSection === 0 && !horaSeleccionada) {
            setValue("horarioDeseado", "");
            trigger("horarioDeseado");

            return;
        }

        if (currentSection === 1) {
            setValue("ubicacionTipo", ubicacionTipo);
        }

        const valid = await trigger(sectionFields);

        if (valid) {
            setCurrentSection(currentSection + 1);
        }
    };

    const handleBack = () => {
        setCurrentSection(currentSection - 1);
    };

    const handleSectionClick = async (index: number) => {
        if (currentSection === 0 && index > 0) return;
        if (currentSection === 1 && index > 1) return;
        if (currentSection === 2 && index > 2) return;
        if (currentSection === 3 && index > 3) return;

        if (index < currentSection) {
            setCurrentSection(index);
            return;
        }

        const sectionFields = Object.keys(sectionsFields[currentSection]);
        const valid = await trigger(sectionFields);
        if (valid) {
            setCurrentSection(index);
        }
    };

    const sections = [
        // Título y Fecha
        <>
            <Typography>Empecemos con lo básico.</Typography>
            <br />
            <Typography>En pocas palabras ¿Qué necesitas que se haga?</Typography>
            <TextField
                placeholder="Ejemplo: Pintar mi casa"
                type="text"
                fullWidth
                {...register("titulo", { required: "El título es obligatorio" })}
                error={!!errors.titulo}
            />
            {errors.titulo && <Typography color="error">El título es obligatorio</Typography>}

            <Typography>¿Cuándo necesitas que se haga esto?</Typography>
            <Box display="flex" gap={2}>
                <Button
                    variant={fechaSeleccionada === "fecha" ? "contained" : "outlined"}
                    onClick={() => handleChangeFecha("fecha")}
                >
                    En la fecha
                </Button>
                <Button
                    variant={fechaSeleccionada === "antes" ? "contained" : "outlined"}
                    onClick={() => handleChangeFecha("antes")}
                >
                    Antes de la fecha
                </Button>
                <Button
                    variant={fechaSeleccionada === "flexible" ? "contained" : "outlined"}
                    onClick={() => handleChangeFecha("flexible")}
                >
                    Soy flexible
                </Button>

            </Box>
            <input type="hidden" {...register("fechaDeseada", { required: "Seleccione una fecha" })} />
            {errors.fechaDeseada && <Typography color="error">Seleccione una fecha</Typography>}

            <br />

            <Typography>¿En qué horario?</Typography>
            <Box display="flex" justifyContent={"center"} gap={2} marginTop={2}>
                <Button
                    variant={horaSeleccionada === "mañana" ? "contained" : "outlined"}
                    onClick={() => handleChangeHorario("mañana")}
                >
                    Mañana
                </Button>
                <Button
                    variant={horaSeleccionada === "tarde" ? "contained" : "outlined"}
                    onClick={() => handleChangeHorario("tarde")}
                >
                    Tarde
                </Button>
                <Button
                    variant={horaSeleccionada === "noche" ? "contained" : "outlined"}
                    onClick={() => handleChangeHorario("noche")}
                >
                    Noche
                </Button>
            </Box>
            <input type="hidden" {...register("horarioDeseado", { required: "Seleccione un horario" })} />
            {errors.fechaDeseada && <Typography color="error">Seleccione una fecha</Typography>}
        </>,

        // Ubicacion
        <>
            <Typography>Dinos dónde</Typography>
            <br />
            <Typography>¿Dónde necesitas que se haga esto?</Typography>

            <Box display="flex" gap={2}>
                <Button
                    variant={ubicacionTipo === "casa" ? "contained" : "outlined"}
                    onClick={() => {
                        setUbicacionTipo("casa");
                        setValue("ubicacionTipo", "casa", { shouldValidate: true });
                    }}
                >
                    En mi casa
                </Button>
                <Button
                    variant={ubicacionTipo === "online" ? "contained" : "outlined"}
                    onClick={() => {
                        setUbicacionTipo("online");
                        setValue("ubicacionTipo", "online", { shouldValidate: true });
                    }}
                >
                    En línea
                </Button>
            </Box>
            <input type="hidden" {...register("ubicacionTipo", { required: "Debe seleccionar una ubicación" })} />
            {errors.ubicacionTipo && <Typography color="error">Seleccione una ubicacion</Typography>}

            {ubicacionTipo === "casa" && (
                <Box mt={2}>
                    <TextField
                        placeholder="Ingrese su ubicación"
                        fullWidth
                        {...register("ubicacion", { required: "La ubicación es obligatoria" })}
                        error={!!errors.ubicacion}
                    />
                    {errors.ubicacion && <Typography color="error">La ubicación es obligatoria</Typography>}
                </Box>
            )}
            {ubicacionTipo === "online" && errors.ubicacion && (
                <Typography color="error">Debe seleccionar una opción</Typography>
            )}
        </>,

        // Detalles
        <>
            <Typography>Proporcionar más detalles</Typography>
            <br />
            <Typography>¿Cuáles son los detalles?</Typography>
            <TextField
                placeholder="Escribe un resumen de los detalles clave"
                multiline
                minRows={4}
                maxRows={6}
                fullWidth
                {...register("descripcion", { required: "La descripción es obligatoria" })}
                error={!!errors.descripcion}
            />
            {errors.descripcion && <Typography color="error">Seleccione una descripcion</Typography>}

            <Typography>Añadir imágenes <span>(opcional)</span></Typography>
            <TextField
                type="file"
                {...register("imagenes")}
            />
        </>,

        // Presupuesto
        <>
            <Typography>Sugiere tu presupuesto</Typography>
            <br />
            <Typography>¿Cuál es tu presupuesto?</Typography>
            <Typography>Siempre puedes negociar el precio final.</Typography>
            <TextField
                fullWidth
                placeholder="Introducir presupuesto"
                type="number"
                {...register("dineroOfrecido", { required: "Su presupuesto es obligatorio" })}
                error={!!errors.dineroOfrecido}
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
            />
            {errors.dineroOfrecido && <Typography color="error">Su presupuesto es obligatorio</Typography>}
        </>
    ];

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "stretch",
                    flex: 1,
                    gap: 2,
                }}
            >
                {/* Sidebar de Secciones */}
                <Box
                    sx={{
                        width: "200px",
                        bgcolor: "white",
                        p: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                    }}
                >
                    <Typography variant="h6" mb={2}>Publicar Tarea</Typography>
                    {["Título y Fecha", "Ubicación", "Detalles", "Presupuesto"].map((label, index) => (
                        <Typography
                            key={index}
                            sx={{
                                justifyContent: "flex-start",
                                textAlign: "left",
                                padding: 0,
                                textTransform: "none",
                                textDecoration: currentSection === index ? "underline" : "none",
                                color: currentSection === index ? "#1976d2" : "inherit",
                                fontWeight: currentSection === index ? "bold" : "normal",
                                transition: "all 0.3s",
                                background: "none",
                                boxShadow: "none",
                                cursor: "pointer"
                            }}
                            onClick={() => handleSectionClick(index)}
                        >
                            {label}
                        </Typography>
                    ))}
                </Box>

                {/* Formulario */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
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
                    {/* Secciones */}
                    {sections.map((section, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: currentSection === index ? "block" : "none",
                            }}
                        >
                            {section}
                        </Box>
                    ))}

                    {/* Navegación entre secciones */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        {currentSection > 0 && (
                            <Button onClick={handleBack} variant="contained" color="primary">Atrás</Button>
                        )}
                        {currentSection < sections.length - 1 && (
                            <Button onClick={handleNext} variant="contained" color="primary">Siguiente</Button>
                        )}
                        {currentSection === sections.length - 1 && (
                            <Button type="submit" variant="contained" color="primary">Enviar</Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

console.log(sessionStorage.getItem("authToken"));