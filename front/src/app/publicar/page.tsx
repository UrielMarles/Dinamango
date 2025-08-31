"use client";

import { TextField, Button, Box, Typography, InputAdornment, Card, CardContent, Stepper, Step, StepLabel, StepButton, Container, IconButton, Chip, Stack, Paper, Avatar, } from "@mui/material";
import {
    Title as TitleIcon,
    LocationOn as LocationIcon,
    Description as DescriptionIcon,
    AttachMoney as MoneyIcon,
    Schedule as ScheduleIcon,
    DateRange as DateIcon,
    Home as HomeIcon,
    Public as OnlineIcon,
    CloudUpload as UploadIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useForm } from "react-hook-form";
import { useState, useCallback } from "react";
import { apiHelper } from "@/helper/apiHelper";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';
import estilos from "./publicar.module.css"

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

interface ImageFile {
    file: File;
    preview: string;
    id: string;
}

export default function TareasForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        reset,
        watch
    } = useForm();

    // Estados
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<boolean[]>([false, false, false, false]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
    const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");
    const [ubicacionTipo, setUbicacionTipo] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { label: 'Título y Fecha', icon: <TitleIcon />, color: '#1ADB1A' },
        { label: 'Ubicación', icon: <LocationIcon />, color: '#1ADB1A' },
        { label: 'Detalles', icon: <DescriptionIcon />, color: '#1ADB1A' },
        { label: 'Presupuesto', icon: <MoneyIcon />, color: '#1ADB1A' }
    ];

    const watchedValues = watch();

    // Manejar cambio de fecha
    const handleChangeFecha = (tipo: string) => {
        setFechaSeleccionada(tipo);
        setValue("fechaDeseada", tipo, { shouldValidate: true });
        trigger("fechaDeseada");
    };

    // Manejar cambio de horario
    const handleChangeHorario = (tipo: string) => {
        setHoraSeleccionada(tipo);
        setValue("horarioDeseado", tipo, { shouldValidate: true });
        trigger("horarioDeseado");
    };

    // Manejar carga de imágenes
    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    const newImage: ImageFile = {
                        file,
                        preview: reader.result as string,
                        id: Math.random().toString(36).substr(2, 9)
                    };
                    setImages(prev => [...prev, newImage]);
                };
                reader.readAsDataURL(file);
            }
        });

        // Reset input
        event.target.value = '';
    }, []);

    // Eliminar imagen
    const removeImage = (id: string) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    // Validar sección actual
    const validateCurrentSection = async (): Promise<boolean> => {
        const sectionFields = getSectionFields(currentSection);

        // Validaciones especiales
        if (currentSection === 0) {
            if (!fechaSeleccionada) {
                setValue("fechaDeseada", "");
                trigger("fechaDeseada");
                return false;
            }
            if (!horaSeleccionada) {
                setValue("horarioDeseado", "");
                trigger("horarioDeseado");
                return false;
            }
        }

        if (currentSection === 1) {
            if (!ubicacionTipo) {
                setValue("ubicacionTipo", "");
                trigger("ubicacionTipo");
                return false;
            }
            setValue("ubicacionTipo", ubicacionTipo);
        }

        return await trigger(sectionFields);
    };

    // Obtener campos de cada sección
    const getSectionFields = (sectionIndex: number): string[] => {
        const sectionFieldsMap = [
            ['titulo', 'fechaDeseada', 'horarioDeseado'],
            ['ubicacionTipo', ...(ubicacionTipo === 'casa' ? ['ubicacion'] : [])],
            ['descripcion'],
            ['dineroOfrecido']
        ];
        return sectionFieldsMap[sectionIndex] || [];
    };

    // Navegar a la siguiente sección
    const handleNext = async () => {
        const isValid = await validateCurrentSection();
        if (isValid) {
            const newCompleted = [...completedSections];
            newCompleted[currentSection] = true;
            setCompletedSections(newCompleted);
            setCurrentSection(prev => prev + 1);
        }
    };

    // Navegar a la sección anterior
    const handleBack = () => {
        setCurrentSection(prev => prev - 1);
    };

    // Navegar a una sección específica
    const handleStepClick = async (stepIndex: number) => {
        if (stepIndex < currentSection) {
            // Permitir ir hacia atrás
            setCurrentSection(stepIndex);
        } else if (stepIndex === currentSection + 1) {
            // Permitir avanzar una sección
            await handleNext();
        }
    };

    // Submit del formulario
    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        const { ubicacionTipo, ...cleanData } = data;

        if (ubicacionTipo === "online") {
            cleanData.ubicacion = "online";
        }

        // Agregar imágenes si las hay
        if (images.length > 0) {
            cleanData.imagenes = images.map(img => img.file);
        }

        try {
            await apiHelper.addTareas(cleanData);
            toast.success("¡Tarea creada con éxito!", {
                duration: 4000,
                icon: '🎉'
            });

            // Reset form
            reset();
            setCurrentSection(0);
            setCompletedSections([false, false, false, false]);
            setUbicacionTipo(null);
            setFechaSeleccionada("");
            setHoraSeleccionada("");
            setSelectedDate(null);
            setSelectedTime(null);
            setImages([]);
        } catch (error) {
            console.error("Error al agregar tarea:", error);
            toast.error("Hubo un problema al publicar la tarea");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animaciones
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    const stepVariants = {
        inactive: { scale: 0.9, opacity: 0.6 },
        active: { scale: 1, opacity: 1 },
        completed: { scale: 1, opacity: 1 }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <Container maxWidth="lg" className={estilos.container}>
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Header */}
                    <MotionPaper className={estilos.header} elevation={2}>
                        <Avatar className={estilos.headerIcon}>
                            <EditIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" className={estilos.headerTitle}>
                                Crear Nueva Tarea
                            </Typography>
                            <Typography variant="subtitle1" className={estilos.headerSubtitle}>
                                Completa la información paso a paso
                            </Typography>
                        </Box>
                    </MotionPaper>

                    <Box className={estilos.mainContent}>
                        {/* Stepper lateral */}
                        <MotionBox className={estilos.sidebar}>
                            <Paper className={estilos.sidebarPaper} elevation={3}>
                                <Typography variant="h6" className={estilos.sidebarTitle}>
                                    Progreso
                                </Typography>

                                <Stepper
                                    activeStep={currentSection}
                                    orientation="vertical"
                                    className={estilos.stepper}
                                >
                                    {steps.map((step, index) => (
                                        <Step
                                            key={step.label}
                                            completed={completedSections[index]}
                                            className={estilos.step}
                                        >
                                            <StepButton
                                                onClick={() => handleStepClick(index)}
                                                className={estilos.stepButton}
                                                disabled={index > currentSection + 1}
                                            >
                                                <StepLabel
                                                    icon={
                                                        <motion.div
                                                            variants={stepVariants}
                                                            animate={
                                                                completedSections[index]
                                                                    ? "completed"
                                                                    : index === currentSection
                                                                        ? "active"
                                                                        : "inactive"
                                                            }
                                                        >
                                                            <Avatar
                                                                className={`${estilos.stepIcon} ${completedSections[index]
                                                                        ? estilos.completed
                                                                        : index === currentSection
                                                                            ? estilos.active
                                                                            : estilos.inactive
                                                                    }`}
                                                            >
                                                                {completedSections[index] ? <CheckIcon /> : step.icon}
                                                            </Avatar>
                                                        </motion.div>
                                                    }
                                                    className={estilos.stepLabel}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        className={`${estilos.stepText} ${index === currentSection ? estilos.activeText : ''
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </Typography>
                                                </StepLabel>
                                            </StepButton>
                                        </Step>
                                    ))}
                                </Stepper>

                                {/* Progress indicator */}
                                <Box className={estilos.progressContainer}>
                                    <Typography variant="body2" className={estilos.progressText}>
                                        {completedSections.filter(Boolean).length} de {steps.length} completado
                                    </Typography>
                                    <Box className={estilos.progressBar}>
                                        <Box
                                            className={estilos.progressFill}
                                            style={{
                                                width: `${(completedSections.filter(Boolean).length / steps.length) * 100}%`
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </MotionBox>

                        {/* Formulario principal */}
                        <MotionBox className={estilos.formContainer}>
                            <MotionCard
                                className={estilos.formCard}
                                elevation={4}
                            >
                                <CardContent
                                    className={estilos.cardContent}
                                    component="form"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <AnimatePresence mode="wait">
                                        {/* Sección 1: Título y Fecha */}
                                        {currentSection === 0 && (
                                            <motion.div
                                                key="section-0"
                                                variants={sectionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={estilos.section}
                                            >
                                                <Box className={estilos.sectionHeader}>
                                                    <TitleIcon className={estilos.sectionIcon} />
                                                    <Typography variant="h5" className={estilos.sectionTitle}>
                                                        Empecemos con lo básico
                                                    </Typography>
                                                </Box>

                                                <Stack spacing={4}>
                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            ¿Qué necesitas que se haga?
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            placeholder="Ejemplo: Pintar mi casa, Diseñar un logo..."
                                                            {...register("titulo", {
                                                                required: "El título es obligatorio",
                                                                minLength: {
                                                                    value: 10,
                                                                    message: "El título debe tener al menos 10 caracteres"
                                                                }
                                                            })}
                                                            error={!!errors.titulo}
                                                            helperText={errors.titulo?.message?.toString()}
                                                            className={estilos.textField}
                                                            slotProps={{
                                                                input: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <EditIcon className={estilos.inputIcon} />
                                                                        </InputAdornment>
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            ¿Cuándo necesitas que se haga?
                                                        </Typography>
                                                        <Stack direction="row" spacing={2} flexWrap="wrap">
                                                            {[
                                                                { value: "fecha", label: "En la fecha", icon: <DateIcon /> },
                                                                { value: "antes", label: "Antes de la fecha", icon: <ScheduleIcon /> },
                                                                { value: "flexible", label: "Soy flexible", icon: <CheckIcon /> }
                                                            ].map((option) => (
                                                                <Chip
                                                                    key={option.value}
                                                                    icon={option.icon}
                                                                    label={option.label}
                                                                    onClick={() => handleChangeFecha(option.value)}
                                                                    color={fechaSeleccionada === option.value ? "primary" : "default"}
                                                                    variant={fechaSeleccionada === option.value ? "filled" : "outlined"}
                                                                    className={`${estilos.chip} ${fechaSeleccionada === option.value ? estilos.chipSelected : ''
                                                                        }`}
                                                                />
                                                            ))}
                                                        </Stack>
                                                        <input type="hidden" {...register("fechaDeseada", { required: "Seleccione cuándo" })} />
                                                        {errors.fechaDeseada && (
                                                            <Typography color="error" variant="caption" className={estilos.errorText}>
                                                                {errors.fechaDeseada.message?.toString()}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            ¿En qué horario?
                                                        </Typography>
                                                        <Stack direction="row" spacing={2} justifyContent="center">
                                                            {[
                                                                { value: "mañana", label: "Mañana (6-12h)", color: "#FFD700" },
                                                                { value: "tarde", label: "Tarde (12-18h)", color: "#FF8C00" },
                                                                { value: "noche", label: "Noche (18-24h)", color: "#4169E1" }
                                                            ].map((option) => (
                                                                <Button
                                                                    key={option.value}
                                                                    variant={horaSeleccionada === option.value ? "contained" : "outlined"}
                                                                    onClick={() => handleChangeHorario(option.value)}
                                                                    className={estilos.timeButton}
                                                                    startIcon={<ScheduleIcon />}
                                                                    style={{
                                                                        backgroundColor: horaSeleccionada === option.value ? option.color : 'transparent',
                                                                        borderColor: option.color,
                                                                        color: horaSeleccionada === option.value ? 'white' : option.color
                                                                    }}
                                                                >
                                                                    {option.label}
                                                                </Button>
                                                            ))}
                                                        </Stack>
                                                        <input type="hidden" {...register("horarioDeseado", { required: "Seleccione un horario" })} />
                                                        {errors.horarioDeseado && (
                                                            <Typography color="error" variant="caption" className={estilos.errorText}>
                                                                {errors.horarioDeseado.message?.toString()}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {/* Selectores de fecha y hora más específicos */}
                                                    {fechaSeleccionada === "fecha" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <Stack direction="row" spacing={2}>
                                                                <DatePicker
                                                                    label="Fecha específica"
                                                                    value={selectedDate}
                                                                    onChange={setSelectedDate}
                                                                    minDate={new Date()}
                                                                    className={estilos.datePicker}
                                                                />
                                                                <TimePicker
                                                                    label="Hora específica"
                                                                    value={selectedTime}
                                                                    onChange={setSelectedTime}
                                                                    className={estilos.timePicker}
                                                                />
                                                            </Stack>
                                                        </motion.div>
                                                    )}
                                                </Stack>
                                            </motion.div>
                                        )}

                                        {/* Sección 2: Ubicación */}
                                        {currentSection === 1 && (
                                            <motion.div
                                                key="section-1"
                                                variants={sectionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={estilos.section}
                                            >
                                                <Box className={estilos.sectionHeader}>
                                                    <LocationIcon className={estilos.sectionIcon} />
                                                    <Typography variant="h5" className={estilos.sectionTitle}>
                                                        ¿Dónde se realizará?
                                                    </Typography>
                                                </Box>

                                                <Stack spacing={4}>
                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            Tipo de ubicación
                                                        </Typography>
                                                        <Stack direction="row" spacing={3} justifyContent="center">
                                                            {[
                                                                { value: "casa", label: "En mi casa", icon: <HomeIcon />, color: "#1ADB1A" },
                                                                { value: "online", label: "En línea", icon: <OnlineIcon />, color: "#2196F3" }
                                                            ].map((option) => (
                                                                <Paper
                                                                    key={option.value}
                                                                    className={`${estilos.locationCard} ${ubicacionTipo === option.value ? estilos.locationCardSelected : ''
                                                                        }`}
                                                                    onClick={() => {
                                                                        setUbicacionTipo(option.value);
                                                                        setValue("ubicacionTipo", option.value, { shouldValidate: true });
                                                                    }}
                                                                    style={{
                                                                        borderColor: ubicacionTipo === option.value ? option.color : '#e0e0e0',
                                                                        backgroundColor: ubicacionTipo === option.value ? `${option.color}10` : 'white'
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        className={estilos.locationIcon}
                                                                        style={{ backgroundColor: option.color }}
                                                                    >
                                                                        {option.icon}
                                                                    </Avatar>
                                                                    <Typography variant="h6" className={estilos.locationLabel}>
                                                                        {option.label}
                                                                    </Typography>
                                                                </Paper>
                                                            ))}
                                                        </Stack>
                                                        <input type="hidden" {...register("ubicacionTipo", { required: "Seleccione una ubicación" })} />
                                                        {errors.ubicacionTipo && (
                                                            <Typography color="error" variant="caption" className={estilos.errorText}>
                                                                {errors.ubicacionTipo.message?.toString()}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {ubicacionTipo === "casa" && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Ingrese su dirección completa"
                                                                {...register("ubicacion", { required: "La ubicación es obligatoria" })}
                                                                error={!!errors.ubicacion}
                                                                helperText={errors.ubicacion?.message?.toString()}
                                                                className={estilos.textField}
                                                                slotProps={{
                                                                    input: {
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <LocationIcon className={estilos.inputIcon} />
                                                                            </InputAdornment>
                                                                        )
                                                                    }
                                                                }}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </Stack>
                                            </motion.div>
                                        )}

                                        {/* Sección 3: Detalles */}
                                        {currentSection === 2 && (
                                            <motion.div
                                                key="section-2"
                                                variants={sectionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={estilos.section}
                                            >
                                                <Box className={estilos.sectionHeader}>
                                                    <DescriptionIcon className={estilos.sectionIcon} />
                                                    <Typography variant="h5" className={estilos.sectionTitle}>
                                                        Proporciona más detalles
                                                    </Typography>
                                                </Box>

                                                <Stack spacing={4}>
                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            Descripción detallada
                                                        </Typography>
                                                        <TextField
                                                            fullWidth
                                                            multiline
                                                            minRows={4}
                                                            maxRows={8}
                                                            placeholder="Describe con detalle qué necesitas, materiales, requisitos específicos, experiencia necesaria, etc."
                                                            {...register("descripcion", {
                                                                required: "La descripción es obligatoria",
                                                                minLength: {
                                                                    value: 50,
                                                                    message: "La descripción debe tener al menos 50 caracteres"
                                                                }
                                                            })}
                                                            error={!!errors.descripcion}
                                                            helperText={errors.descripcion?.message?.toString() || `${watchedValues.descripcion?.length || 0}/500 caracteres`}
                                                            className={estilos.textArea}
                                                            slotProps={{
                                                                input: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                                                                            <DescriptionIcon className={estilos.inputIcon} />
                                                                        </InputAdornment>
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    </Box>

                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            Imágenes de referencia
                                                            <Chip label="Opcional" size="small" className={estilos.optionalChip} />
                                                        </Typography>

                                                        <Paper className={estilos.uploadArea}>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                onChange={handleImageUpload}
                                                                style={{ display: 'none' }}
                                                                id="image-upload"
                                                            />
                                                            <label htmlFor="image-upload" className={estilos.uploadLabel}>
                                                                <Box className={estilos.uploadContent}>
                                                                    <UploadIcon className={estilos.uploadIcon} />
                                                                    <Typography variant="h6" className={estilos.uploadText}>
                                                                        Arrastra imágenes aquí o haz clic para seleccionar
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        Formatos: JPG, PNG, GIF (máx. 5MB cada una)
                                                                    </Typography>
                                                                </Box>
                                                            </label>
                                                        </Paper>

                                                        {images.length > 0 && (
                                                            <Box className={estilos.imagePreviewContainer}>
                                                                <Typography variant="subtitle1" className={estilos.previewTitle}>
                                                                    Imágenes seleccionadas ({images.length})
                                                                </Typography>
                                                                <Box className={estilos.imageGrid}>
                                                                    {images.map((image) => (
                                                                        <motion.div
                                                                            key={image.id}
                                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            className={estilos.imagePreview}
                                                                        >
                                                                            <img
                                                                                src={image.preview}
                                                                                alt="Preview"
                                                                                className={estilos.previewImage}
                                                                            />
                                                                            <IconButton
                                                                                className={estilos.removeImageButton}
                                                                                onClick={() => removeImage(image.id)}
                                                                                size="small"
                                                                            >
                                                                                <DeleteIcon />
                                                                            </IconButton>
                                                                            <Typography variant="caption" className={estilos.imageFilename}>
                                                                                {image.file.name}
                                                                            </Typography>
                                                                        </motion.div>
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Stack>
                                            </motion.div>
                                        )}

                                        {/* Sección 4: Presupuesto */}
                                        {currentSection === 3 && (
                                            <motion.div
                                                key="section-3"
                                                variants={sectionVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                className={estilos.section}
                                            >
                                                <Box className={estilos.sectionHeader}>
                                                    <MoneyIcon className={estilos.sectionIcon} />
                                                    <Typography variant="h5" className={estilos.sectionTitle}>
                                                        Sugiere tu presupuesto
                                                    </Typography>
                                                </Box>

                                                <Stack spacing={4}>
                                                    <Box>
                                                        <Typography variant="h6" className={estilos.fieldLabel}>
                                                            ¿Cuál es tu presupuesto?
                                                        </Typography>
                                                        <Typography variant="body1" color="text.secondary" className={estilos.budgetSubtext}>
                                                            Siempre puedes negociar el precio final con el profesional
                                                        </Typography>

                                                        <TextField
                                                            fullWidth
                                                            type="number"
                                                            placeholder="0"
                                                            {...register("dineroOfrecido", {
                                                                required: "El presupuesto es obligatorio",
                                                                min: {
                                                                    value: 100,
                                                                    message: "El presupuesto mínimo es $100"
                                                                },
                                                                max: {
                                                                    value: 1000000,
                                                                    message: "El presupuesto máximo es $1,000,000"
                                                                }
                                                            })}
                                                            error={!!errors.dineroOfrecido}
                                                            helperText={errors.dineroOfrecido?.message?.toString()}
                                                            className={estilos.budgetField}
                                                            slotProps={{
                                                                input: {
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Box className={estilos.currencyIcon}>
                                                                                <MoneyIcon />
                                                                                <Typography variant="h6">$</Typography>
                                                                            </Box>
                                                                        </InputAdornment>
                                                                    ),
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                ARS
                                                                            </Typography>
                                                                        </InputAdornment>
                                                                    )
                                                                }
                                                            }}
                                                        />

                                                        {/* Rangos de presupuesto sugeridos */}
                                                        <Box className={estilos.budgetSuggestions}>
                                                            <Typography variant="subtitle2" className={estilos.suggestionsTitle}>
                                                                Rangos sugeridos:
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                {[
                                                                    { range: "500-2000", label: "Básico" },
                                                                    { range: "2000-5000", label: "Intermedio" },
                                                                    { range: "5000-10000", label: "Avanzado" },
                                                                    { range: "10000+", label: "Premium" }
                                                                ].map((suggestion) => (
                                                                    <Chip
                                                                        key={suggestion.range}
                                                                        label={`${suggestion.range} - ${suggestion.label}`}
                                                                        variant="outlined"
                                                                        className={estilos.budgetChip}
                                                                        onClick={() => {
                                                                            const minValue = suggestion.range.split('-')[0].replace('+', '');
                                                                            setValue("dineroOfrecido", parseInt(minValue));
                                                                        }}
                                                                    />
                                                                ))}
                                                            </Stack>
                                                        </Box>
                                                    </Box>

                                                    {/* Resumen final */}
                                                    <Paper className={estilos.summaryCard}>
                                                        <Typography variant="h6" className={estilos.summaryTitle}>
                                                            📋 Resumen de tu tarea
                                                        </Typography>
                                                        <Stack spacing={2}>
                                                            <Box>
                                                                <Typography variant="subtitle2" color="primary">Título:</Typography>
                                                                <Typography variant="body1">{watchedValues.titulo || "Sin especificar"}</Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="subtitle2" color="primary">Ubicación:</Typography>
                                                                <Typography variant="body1">
                                                                    {ubicacionTipo === "online" ? "En línea" : watchedValues.ubicacion || "Sin especificar"}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="subtitle2" color="primary">Cuándo:</Typography>
                                                                <Typography variant="body1">
                                                                    {fechaSeleccionada ? `${fechaSeleccionada} - ${horaSeleccionada}` : "Sin especificar"}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="subtitle2" color="primary">Presupuesto:</Typography>
                                                                <Typography variant="h6" className={estilos.summaryBudget}>
                                                                    ${watchedValues.dineroOfrecido ? parseInt(watchedValues.dineroOfrecido).toLocaleString() : "0"}
                                                                </Typography>
                                                            </Box>
                                                            {images.length > 0 && (
                                                                <Box>
                                                                    <Typography variant="subtitle2" color="primary">Imágenes:</Typography>
                                                                    <Typography variant="body1">{images.length} imagen{images.length > 1 ? 'es' : ''}</Typography>
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </Paper>
                                                </Stack>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Navegación */}
                                    <Box className={estilos.navigation}>
                                        <Box className={estilos.navigationButtons}>
                                            {currentSection > 0 && (
                                                <Button
                                                    onClick={handleBack}
                                                    variant="outlined"
                                                    size="large"
                                                    className={estilos.backButton}
                                                >
                                                    Atrás
                                                </Button>
                                            )}

                                            {currentSection < steps.length - 1 ? (
                                                <Button
                                                    onClick={handleNext}
                                                    variant="contained"
                                                    size="large"
                                                    className={estilos.nextButton}
                                                >
                                                    Siguiente
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    disabled={isSubmitting}
                                                    className={`${estilos.submitButton} ${isSubmitting ? estilos.submitting : ''}`}
                                                >
                                                    {isSubmitting ? "Publicando..." : "🚀 Publicar Tarea"}
                                                </Button>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </MotionCard>
                        </MotionBox>
                    </Box>
                </motion.div>
            </Container>
        </LocalizationProvider>
    );
}