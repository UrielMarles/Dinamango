"use client";

import { useState, useEffect, useMemo } from "react";
import { Container, Box, Typography, TextField, InputAdornment, Paper, Stack, Pagination, FormControl, InputLabel, Select, MenuItem, Chip, Avatar } from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Task as TaskIcon,
    LocationOn as LocationIcon,
    AttachMoney as MoneyIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TareaCard from '../../components/tarea-card/tarea-card.component';
import { apiHelper } from "@/helper/apiHelper";
import estilos from "./tareas.module.css";
import { Publicacion } from "@/types/Dto/Publicacion";

const ITEMS_PER_PAGE = 10;

const getImage = async (userId: string) => {
    try {
        const img = await apiHelper.getProfilePicture(userId);

        return img;
    }
    catch (error) {
        return null;
    }
};

const MotionBox = motion(Box);

export default function Tareas() {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState<OpcionesBusqueda>('recientes');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await apiHelper.getTareas();

                if (!data) return;

                const publicacionesActualizadas = await Promise.all( // Arreglar error imagenes sin iniciar sesion
                    data.map(async (pub: Publicacion) => {
                        let profilePictureUrl;

                        if (!pub.creador.isGoogleUser) {
                            const blob = await getImage(pub.creador.id);
                            profilePictureUrl = blob ? URL.createObjectURL(blob) : undefined;
                        }
                        else {
                            profilePictureUrl = pub.creador.profilePictureUrl;
                        }
                        return {
                            ...pub,
                            creador: {
                                ...pub.creador,
                                profilePictureUrl
                            }
                        };
                    })
                );

                setPublicaciones(publicacionesActualizadas);
            }
            catch (error) {
                console.error("Error al obtener publicaciones:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrado y ordenamiento de tareas
    const filteredAndSortedTareas = useMemo(() => {
        let filtered = publicaciones.filter(pub => {
            const matchesSearch =
                pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pub.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pub.creador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                pub.creador.apellido.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = !locationFilter ||
                pub.ubicacion.toLowerCase().includes(locationFilter.toLowerCase());

            const matchesPrice = pub.dineroOfrecido >= priceRange[0] &&
                pub.dineroOfrecido <= priceRange[1];

            return matchesSearch && matchesLocation && matchesPrice;
        });

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recientes':
                    return new Date(b.fechaDeseada).getTime() - new Date(a.fechaDeseada).getTime();
                case 'antiguos':
                    return new Date(a.fechaDeseada).getTime() - new Date(b.fechaDeseada).getTime();
                case 'precio_alto':
                    return b.dineroOfrecido - a.dineroOfrecido;
                case 'precio_bajo':
                    return a.dineroOfrecido - b.dineroOfrecido;
                case 'mas_ofertas':
                    return (b.cantidadOfertas || 0) - (a.cantidadOfertas || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [publicaciones, searchTerm, locationFilter, priceRange, sortBy]);

    // Paginado
    const totalPages = Math.ceil(filteredAndSortedTareas.length / ITEMS_PER_PAGE);
    const paginatedTareas = filteredAndSortedTareas.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Obtener ubicaciones únicas para el filtro
    const uniqueLocations = Array.from(
        new Set(publicaciones.map(pub => pub.ubicacion))
    ).sort();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleLocationChange = (event: any) => {
        setLocationFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (event: any) => {
        setSortBy(event.target.value as OpcionesBusqueda);
        setCurrentPage(1);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApplyToTask = (taskId: string) => {
        // Redirigir a la página de detalles
        window.location.href = `/detalles/${taskId}`;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setLocationFilter('');
        setPriceRange([0, 100000]);
        setSortBy('recientes');
        setCurrentPage(1);
    };

    const activeFiltersCount = [
        searchTerm,
        locationFilter,
        priceRange[0] > 0 || priceRange[1] < 100000 ? 'price' : '',
    ].filter(Boolean).length;

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

    if (loading) {
        return (
            <Container maxWidth="xl" className={estilos.container}>
                <Box className={estilos.loadingContainer}>
                    <Typography variant="h6" color="text.secondary">
                        Cargando tareas disponibles...
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
                {/* Header */}
                <MotionBox variants={cardVariants} className={estilos.headerSection}>
                    <Paper className={estilos.headerPaper}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar className={estilos.headerAvatar}>
                                <TaskIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Box>
                                <Typography variant="h4" className={estilos.headerTitle}>
                                    Tareas Disponibles
                                </Typography>
                                <Typography variant="subtitle1" className={estilos.headerSubtitle}>
                                    Encuentra la tarea perfecta para ti
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </MotionBox>

                {/* Filtros */}
                <MotionBox variants={cardVariants} className={estilos.filtersSection}>
                    <Paper className={estilos.filtersPaper}>
                        <Stack spacing={3}>
                            {/* Barra de búsqueda */}
                            <TextField
                                fullWidth
                                placeholder="Buscar por título, descripción o creador..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon className={estilos.searchIcon} />
                                        </InputAdornment>
                                    ),
                                }}
                                className={estilos.searchField}
                            />

                            {/* Filtros en línea */}
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={2}
                                alignItems={{ sm: 'center' }}
                            >
                                <FormControl size="small" className={estilos.filterControl}>
                                    <InputLabel>Ubicación</InputLabel>
                                    <Select
                                        value={locationFilter}
                                        onChange={handleLocationChange}
                                        label="Ubicación"
                                    >
                                        <MenuItem value="">Todas las ubicaciones</MenuItem>
                                        {uniqueLocations.map(location => (
                                            <MenuItem key={location} value={location}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <LocationIcon sx={{ fontSize: 16, color: '#1ADB1A' }} />
                                                    <span>{location}</span>
                                                </Stack>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" className={estilos.filterControl}>
                                    <InputLabel>Ordenar por</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        label="Ordenar por"
                                    >
                                        <MenuItem value="recientes">Más recientes</MenuItem>
                                        <MenuItem value="antiguos">Más antiguos</MenuItem>
                                        <MenuItem value="precio_alto">Mayor precio</MenuItem>
                                        <MenuItem value="precio_bajo">Menor precio</MenuItem>
                                        <MenuItem value="mas_ofertas">Más populares</MenuItem>
                                    </Select>
                                </FormControl>

                                <Box className={estilos.filterActions}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {activeFiltersCount > 0 && (
                                            <Chip
                                                icon={<FilterIcon />}
                                                label={`${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''}`}
                                                onDelete={clearFilters}
                                                deleteIcon={<ClearIcon />}
                                                className={estilos.activeFiltersChip}
                                            />
                                        )}
                                        <Typography variant="body2" color="text.secondary">
                                            {filteredAndSortedTareas.length} de {publicaciones.length} tareas
                                        </Typography>
                                    </Stack>
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                </MotionBox>

                {/* Lista de tareas */}
                <MotionBox variants={cardVariants} className={estilos.contentSection}>
                    {paginatedTareas.length === 0 ? (
                        <Paper className={estilos.emptyState}>
                            <TaskIcon className={estilos.emptyIcon} />
                            <Typography variant="h6" className={estilos.emptyTitle}>
                                No se encontraron tareas
                            </Typography>
                            <Typography variant="body2" className={estilos.emptySubtitle}>
                                {publicaciones.length === 0
                                    ? 'No hay tareas disponibles en este momento'
                                    : 'Prueba ajustando los filtros de búsqueda'
                                }
                            </Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={3}>
                            {paginatedTareas.map((publicacion, index) => (
                                <TareaCard
                                    key={publicacion.id}
                                    tarea={publicacion}
                                    index={index}
                                    variant="external"
                                    onApply={handleApplyToTask}
                                />
                            ))}
                        </Stack>
                    )}
                </MotionBox>

                {/* Paginación */}
                {totalPages > 1 && (
                    <MotionBox variants={cardVariants} className={estilos.paginationSection}>
                        <Paper className={estilos.paginationPaper}>
                            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                <Typography variant="body2" color="text.secondary">
                                    Página {currentPage} de {totalPages}
                                </Typography>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="medium"
                                    className={estilos.pagination}
                                    showFirstButton
                                    showLastButton
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {filteredAndSortedTareas.length} resultados total
                                </Typography>
                            </Stack>
                        </Paper>
                    </MotionBox>
                )}
            </motion.div>
        </Container>
    );
}