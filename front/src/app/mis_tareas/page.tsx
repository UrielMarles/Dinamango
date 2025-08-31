"use client";

import { apiHelper } from "@/helper/apiHelper";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Card, CardContent, Typography, Chip, Avatar, Container, Paper, Stack, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, Badge, Button } from '@mui/material';
import {
    Task as TaskIcon,
    Assignment as AssignmentIcon,
    Message as MessageIcon,
    CheckCircle as CheckCircleIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TareaCard from "../../components/tarea-card/tarea-card.component"
import estilos from "./mis_tareas.module.css";
import { Tarea } from "@/types/Dto/Tarea";
import { Oferta } from "@/types/Dto/Oferta";
import toast from "react-hot-toast";
import Popup from "./popup";
import Swal from "sweetalert2"

type FilterType = 'todas' | 'activas' | 'terminadas' | 'buscando_ofertas' | 'en_progreso';
type TabType = 'tareas' | 'ofertas';

function getTareas() {
    return apiHelper.getUserTareas();
}

function getOfertas() {
    return apiHelper.getMisOfertas();
}

function editarTarea(id: string, data: any) {
    return apiHelper.updateTareas(id, data);
}

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function MisTareas() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('tareas');
    const [filter, setFilter] = useState<FilterType>('todas');
    const [popupOpen, setPopupOpen] = useState(false);
    const [idTarea, setIdTarea] = useState<string | null>(null);

    const {
        handleSubmit,
        register
    } = useForm();

    function abrirPopup() {
        setPopupOpen(true);
    }

    function cerrarPopup() {
        setPopupOpen(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tareasData, ofertasData] = await Promise.all([
                    getTareas(),
                    getOfertas()
                ]);
                setTareas(tareasData);
                setOfertas(ofertasData);

                if (tareasData.length === 0 && ofertasData.length > 0) {
                    setActiveTab('ofertas');
                } else {
                    setActiveTab('tareas');
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredTareas = tareas.filter(tarea => {
        if (filter === 'todas') return true;
        if (filter === 'activas') {
            return tarea.estado === 'buscando_ofertas' || tarea.estado === 'en_progreso'
        }
        return tarea.estado === filter;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: TabType) => {
        setActiveTab(newValue);
    };

    const handleFilterChange = (event: any) => {
        setFilter(event.target.value as FilterType);
    };

    // Ver detalles de la tarea
    const handleViewTarea = (id: string) => {
        window.location.href = `/detalles/${id}`;
    };

    // Editar tarea
    const handleEditTarea = (id: string) => {
        const tareaToEdit = tareas.find(t => t.id === id);
        setIdTarea(tareaToEdit?.id || null);

        abrirPopup();
    };

    //Subir cambios del edit
    const onSubmit = async (data: any) => { // ARREGLAR
        const id = idTarea;

        const updateData = await editarTarea(id!, data);

        console.log("ID", id);

        setTareas(prev => prev.map(t => t.id === id ? { ...t, ...updateData } : t));

        toast.success("¡Tarea actualizada correctamente!", {
            duration: 4000,
            icon: '🎉'
        });

        // getTareas() // Intentar optimizar
        //     .then((tareasData) => {
        //         setTareas(tareasData);
        //     });

        cerrarPopup();
    }

    // Eliminar tarea
    const handleDeleteTarea = async (id: string) => {
        Swal.fire({
            icon: 'warning',
            title: '¿Está seguro que desea eliminar la tarea?',
            text: 'Esta acción no se puede deshacer.',
            showCancelButton: true,
            confirmButtonText: 'Eliminar', // negro letras blancas
            cancelButtonText: 'Mantener' // blanco letras negras
        })
            .then(async (results) => {
                if (results.isConfirmed) {
                    toast.success("¡Tarea eliminada correctamente!", {
                        duration: 2000,
                        icon: '🎉'
                    });

                    await apiHelper.deleteTareas(id);

                    getTareas() // Intentar optimizar
                        .then((tareasData) => {
                            setTareas(tareasData);
                        });
                }
            });
    };

    if (loading) {
        return (
            <Container maxWidth="xl" className={estilos.container}>
                <Box className={estilos.loadingContainer}>
                    <Typography variant="h6" color="text.secondary">
                        Cargando...
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" className={estilos.container}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <MotionBox
                    variants={cardVariants}
                    className={estilos.headerSection}
                >
                    <Paper className={estilos.headerPaper}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar className={estilos.headerAvatar}>
                                <TaskIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" className={estilos.headerTitle}>
                                    Mi Panel de Control
                                </Typography>
                                <Typography variant="subtitle1" className={estilos.headerSubtitle}>
                                    Gestiona tus tareas y ofertas
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </MotionBox>

                {/* Navegación por pestañas */}
                <MotionBox
                    variants={cardVariants}
                    className={estilos.tabsSection}
                >
                    <Paper className={estilos.tabsPaper}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            className={estilos.tabs}
                            variant="fullWidth"
                        >
                            <Tab
                                label={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <TaskIcon />
                                        <span>Mis Tareas</span>
                                        <Badge badgeContent={tareas.length} className={estilos.tabBadge}>
                                            <Box />
                                        </Badge>
                                    </Stack>
                                }
                                value="tareas"
                                className={estilos.tab}
                            />
                            <Tab
                                label={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <AssignmentIcon />
                                        <span>Mis Ofertas</span>
                                        <Badge badgeContent={ofertas.length} className={estilos.tabBadge}>
                                            <Box />
                                        </Badge>
                                    </Stack>
                                }
                                value="ofertas"
                                className={estilos.tab}
                            />
                        </Tabs>
                    </Paper>
                </MotionBox>
                {activeTab === 'tareas' && (
                    <MotionBox
                        variants={cardVariants}
                        className={estilos.filterSection}
                    >
                        <Paper className={estilos.filterPaper}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <FilterIcon className={estilos.filterIcon} />
                                <FormControl size="small" className={estilos.filterControl}>
                                    <InputLabel>Filtrar por estado</InputLabel>
                                    <Select
                                        value={filter}
                                        onChange={handleFilterChange}
                                        label="Filtrar por estado"
                                        className={estilos.filterSelect}
                                    >
                                        <MenuItem value="todas">Todas</MenuItem>
                                        <MenuItem value="activas">Activas</MenuItem>
                                        <MenuItem value="buscando_ofertas">Buscando ofertas</MenuItem>
                                        <MenuItem value="en_progreso">En progreso</MenuItem>
                                        <MenuItem value="terminadas">Terminadas</MenuItem>
                                    </Select>
                                </FormControl>
                                <Typography variant="body2" color="text.secondary">
                                    {filteredTareas.length} de {tareas.length} tareas
                                </Typography>
                            </Stack>
                        </Paper>
                    </MotionBox>
                )}
                <Box className={estilos.contentSection}>
                    {activeTab === 'tareas' ? (
                        <Box className={estilos.tareasContainer}>
                            {filteredTareas.length === 0 ? (
                                <MotionCard
                                    variants={cardVariants}
                                    className={estilos.emptyCard}
                                >
                                    <CardContent className={estilos.emptyContent}>
                                        <TaskIcon className={estilos.emptyIcon} />
                                        <Typography variant="h6" className={estilos.emptyTitle}>
                                            {filter === 'todas' ? 'No tienes tareas publicadas' : `No tienes tareas ${filter === 'activas' ? 'activas' : filter.replace('_', ' ')}`
                                            }
                                        </Typography>
                                        <Typography variant="body2" className={estilos.emptySubtitle}>
                                            {filter === 'todas' ? '¡Crea tu primera tarea para comenzar!' : 'Prueba cambiando el filtro para ver otras tareas'
                                            }
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            ) : (
                                <Stack spacing={3}>
                                    {filteredTareas.map((tarea, index) => (
                                        <TareaCard
                                            key={tarea.id}
                                            tarea={tarea}
                                            index={index}
                                            onView={handleViewTarea}
                                            onEdit={handleEditTarea}
                                            onDelete={handleDeleteTarea}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    ) : (
                        <Box className={estilos.ofertasContainer}>
                            {ofertas.length === 0 ? (
                                <MotionCard
                                    variants={cardVariants}
                                    className={estilos.emptyCard}
                                >
                                    <CardContent className={estilos.emptyContent}>
                                        <MessageIcon className={estilos.emptyIcon} />
                                        <Typography variant="h6" className={estilos.emptyTitle}>
                                            No has hecho ninguna oferta
                                        </Typography>
                                        <Typography variant="body2" className={estilos.emptySubtitle}>
                                            Explora tareas disponibles y comienza a ofertar
                                        </Typography>
                                    </CardContent>
                                </MotionCard>
                            ) : (
                                <Stack spacing={3}>
                                    {ofertas.map((oferta, index) => (
                                        <MotionCard
                                            key={oferta.id}
                                            variants={cardVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: index * 0.1 }}
                                            className={estilos.ofertaCard}
                                        >
                                            <Box className={estilos.ofertaCardBorder} />

                                            <CardContent className={estilos.ofertaCardContent}>
                                                <Stack direction="row" alignItems="flex-start" spacing={2} className={estilos.ofertaHeader}>
                                                    <Avatar className={estilos.ofertaAvatar}>
                                                        <MessageIcon />
                                                    </Avatar>
                                                    <Box flex={1}>
                                                        <Typography variant="h6" className={estilos.ofertaTitle}>
                                                            Tu Oferta
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            className={estilos.ofertaMensaje}
                                                        >
                                                            "{oferta.mensajeOferta}"
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Box className={estilos.ofertaDivider} />

                                                <Typography variant="subtitle1" className={estilos.ofertaTareaLabel}>
                                                    Tarea:
                                                </Typography>
                                                <Box className={estilos.ofertaTareaInfo}>
                                                    <Typography variant="h6" className={estilos.ofertaTareaTitulo}>
                                                        {oferta.tarea.titulo}
                                                    </Typography>
                                                </Box>

                                                <Box className={estilos.ofertaFooter}>
                                                    <Chip
                                                        icon={<CheckCircleIcon />}
                                                        label="Oferta Enviada"
                                                        size="small"
                                                        className={estilos.ofertaStatus}
                                                    />
                                                </Box>
                                            </CardContent>
                                        </MotionCard>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    )}
                </Box>
            </motion.div>
            <Popup isOpen={popupOpen} onClose={cerrarPopup} title="Editar Tarea">
                {tareas.map(tarea => {
                    if (tarea.id === idTarea) {
                        return (
                            <form key={tarea.id} onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="titulo">Título: </label>
                                    <input type="text" id="titulo" {...register("titulo")} defaultValue={tarea.titulo} />
                                </div>
                                <div>
                                    <label htmlFor="descripcion">Descripción: </label>
                                    <input type="text" id="descripcion" {...register("descripcion")} defaultValue={tarea.descripcion} />
                                </div>
                                <div>
                                    <label htmlFor="ubicacion">Ubicacion: </label>
                                    <input type="text" id="ubicacion" {...register("ubicacion")} defaultValue={tarea.ubicacion} />
                                </div>
                                <div>
                                    <label htmlFor="horarioDeseado">Horario:</label>
                                    <input type="text" id="horarioDeseado" {...register("horarioDeseado")} defaultValue={tarea.horarioDeseado} />
                                </div>
                                <div>
                                    <label htmlFor="fechaDeseada">Fecha:</label>
                                    <input type="text" id="fechaDeseada" {...register("fechaDeseada")} defaultValue={tarea.fechaDeseada} />
                                </div>
                                <div>
                                    <label htmlFor="precio">Precio: </label>
                                    <input type="number" id="precio" {...register("dineroOfrecido")} defaultValue={tarea.dineroOfrecido} />
                                </div>
                                <Button variant="contained" color="primary" type="submit">
                                    Guardar cambios
                                </Button>
                            </form>
                        )
                    }
                })}
            </Popup>
        </Container>
    );
}