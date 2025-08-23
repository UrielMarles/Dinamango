"use client";

import { apiHelper } from "@/helper/apiHelper";
import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    Container,
    Paper,
    Stack,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Badge
} from '@mui/material';
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


type FilterType = 'todas' | 'activas' | 'terminadas' | 'buscando_ofertas' | 'en_progreso';
type TabType = 'tareas' | 'ofertas';

function getTareas() {
    return apiHelper.getUserTareas();
}

function getOfertas() {
    return apiHelper.getMisOfertas();
}

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function MisTareas() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('tareas');
    const [filter, setFilter] = useState<FilterType>('todas');

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

    const handleViewTarea = (id: string) => {
        console.log('Ver tarea:', id);
        // Implementar lógica para ver tarea
    };

    const handleEditTarea = (id: string) => {
        console.log('Editar tarea:', id);
        // Implementar lógica para editar tarea
    };

    const handleDeleteTarea = (id: string) => {
        console.log('Eliminar tarea:', id);
        // Implementar lógica para eliminar tarea
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
                                            {filter === 'todas' 
                                                ? 'No tienes tareas publicadas'
                                                : `No tienes tareas ${filter === 'activas' ? 'activas' : filter.replace('_', ' ')}`
                                            }
                                        </Typography>
                                        <Typography variant="body2" className={estilos.emptySubtitle}>
                                            {filter === 'todas' 
                                                ? '¡Crea tu primera tarea para comenzar!'
                                                : 'Prueba cambiando el filtro para ver otras tareas'
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
        </Container>
    );
}