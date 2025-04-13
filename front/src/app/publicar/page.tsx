/* eslint-disable */
"use client";

import { TextField, Button, Box, Typography, InputAdornment, createTheme } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiHelper } from "@/helper/apiHelper";

const estiloTitulo = (color: string, fontSize: string, fontWeight: string, letterSpacing: string) => ({
    color: color,
    fontSize: fontSize,
    fontWeight: fontWeight,
    letterSpacing: letterSpacing,
});

const estiloLabel = (fontSize: string, letterSpacing: string) => ({
    fontSize: fontSize,
    letterSpacing: letterSpacing,
});

const estiloInput = (color: string, fontSize: string, fontWeight: string) => ({
    "& input": {
        color: color,
        fontSize: fontSize,
        fontWeight: fontWeight,
        "&::placeholder": {
            color: "black",
            fontSize: "18px",
        }
    }
});

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

        // window.location.reload();
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
            <Typography
                style={estiloTitulo("#0acc0a", "30px", "900", "-2px")}
            >
                Empecemos con lo básico.</Typography>
            <br />
            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                En pocas palabras ¿Qué necesitas que se haga?
            </Typography>
            <TextField
                placeholder="Ejemplo: Pintar mi casa"
                type="text"
                fullWidth
                {...register("titulo", { required: "El título es obligatorio" })}
                error={!!errors.titulo}
                sx={estiloInput("#757575", "18px", "500")}
            />
            {errors.titulo && <Typography color="error">El título es obligatorio</Typography>}

            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                ¿Cuándo necesitas que se haga esto?
            </Typography>
            <Box display="flex" gap={2}>
                <Button
                    onClick={() => handleChangeFecha("fecha")}
                    variant={fechaSeleccionada === "fecha" ? "contained" : "outlined"}
                >
                    En la fecha
                </Button>
                <Button
                    onClick={() => handleChangeFecha("antes")}
                    variant={fechaSeleccionada === "antes" ? "contained" : "outlined"}
                >
                    Antes de la fecha
                </Button>
                <Button
                    onClick={() => handleChangeFecha("flexible")}
                    variant={fechaSeleccionada === "flexible" ? "contained" : "outlined"}
                >
                    Soy flexible
                </Button>

            </Box>
            <input type="hidden" {...register("fechaDeseada", { required: "Seleccione una fecha" })} />
            {errors.fechaDeseada && <Typography color="error">Seleccione una fecha</Typography>}

            <br />

            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                ¿En qué horario?
            </Typography>
            <Box display="flex" justifyContent={"center"} gap={2} marginTop={2}>
                <Button
                    onClick={() => handleChangeHorario("mañana")}
                    variant={horaSeleccionada === "mañana" ? "contained" : "outlined"}
                >
                    Mañana
                </Button>
                <Button
                    onClick={() => handleChangeHorario("tarde")}
                    variant={horaSeleccionada === "tarde" ? "contained" : "outlined"}
                >
                    Tarde
                </Button>
                <Button
                    onClick={() => handleChangeHorario("noche")}
                    variant={horaSeleccionada === "noche" ? "contained" : "outlined"}
                >
                    Noche
                </Button>
            </Box>
            <input type="hidden" {...register("horarioDeseado", { required: "Seleccione un horario" })} />
            {errors.fechaDeseada && <Typography color="error">Seleccione un horario</Typography>}
        </>,

        // Ubicacion
        <>
            <Typography
                sx={{
                    fontWeight: "900",
                    fontSize: "30px",
                    letterSpacing: "-2px",
                    color: "#0acc0a",
                }}
            >
                Dinos dónde
            </Typography>
            <br />
            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                ¿Dónde necesitas que se haga esto?
            </Typography>

            <Box display="flex" gap={2}>
                <Button
                    onClick={() => {
                        setUbicacionTipo("casa");
                        setValue("ubicacionTipo", "casa", { shouldValidate: true });
                    }}
                    variant={ubicacionTipo === "casa" ? "contained" : "outlined"}
                >
                    En mi casa
                </Button>
                <Button
                    onClick={() => {
                        setUbicacionTipo("online");
                        setValue("ubicacionTipo", "online", { shouldValidate: true });
                    }}
                    variant={ubicacionTipo === "online" ? "contained" : "outlined"}
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
                        sx={estiloInput("#757575", "18px", "500")}
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
            <Typography
                style={estiloTitulo("#0acc0a", "30px", "900", "-2px")}
            >
                Proporcionar más detalles
            </Typography>
            <br />
            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                ¿Cuáles son los detalles?
            </Typography>
            <TextField
                placeholder="Escribe un resumen de los detalles clave"
                multiline
                minRows={4}
                maxRows={6}
                fullWidth
                {...register("descripcion", { required: "La descripción es obligatoria" })}
                error={!!errors.descripcion}
                sx={{
                    "& .MuiInputBase-input": {
                        color: "#757575",
                        fontSize: "18px",
                        fontWeight: 500,
                        "&::placeholder": {
                            color: "black",
                            fontSize: "18px",
                        },
                    },
                    "& .MuiInputBase-inputMultiline": {
                        color: "#757575",
                        fontSize: "18px",
                        fontWeight: 500,
                        "&::placeholder": {
                            color: "black",
                            fontSize: "18px",
                        },
                    }
                }}
            />
            {errors.descripcion && <Typography color="error">Seleccione una descripcion</Typography>}

            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                Añadir imágenes <span style={{ fontSize: "12px" }}>(opcional)</span>
            </Typography>
            <TextField
                type="file"
                {...register("imagenes")}
            />
        </>,

        // Presupuesto
        <>
            <Typography
                style={estiloTitulo("#0acc0a", "30px", "900", "-2px")}
            >
                Sugiere tu presupuesto
            </Typography>
            <br />
            <Typography
                style={estiloLabel("20px", "-1px")}
            >
                ¿Cuál es tu presupuesto?
            </Typography>
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
                    <Typography
                        variant="h5"
                        mb={2}
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        <span style={{ borderBottom: "2px solid black" }}>
                            Publicar Tarea
                        </span>
                    </Typography>
                    {["Título y Fecha", "Ubicación", "Detalles", "Presupuesto"].map((label, index) => (
                        <Typography
                            key={index}
                            sx={{
                                justifyContent: "flex-start",
                                textAlign: "left",
                                padding: 0,
                                textTransform: "none",
                                fontSize: "18px",
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

// PANTALLA < 836px quitar el sidebar