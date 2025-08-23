import {
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    IconButton,
    Badge,
    Stack,
    Box,
    Avatar,
    Button
} from '@mui/material';
import {
    LocationOn as LocationIcon,
    Schedule as ScheduleIcon,
    CalendarToday as CalendarIcon,
    AttachMoney as MoneyIcon,
    People as PeopleIcon,
    TrendingUp as TrendingUpIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Assignment as AssignmentIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import estilos from "./tarea-card.module.css";

interface Usuario {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    isGoogleUser: boolean;
    profilePictureUrl: string;
}

interface Tarea {
    id: string;
    titulo: string;
    descripcion: string;
    ubicacion: string;
    fechaDeseada: string;
    horarioDeseado: string;
    dineroOfrecido: number;
    cantidadOfertas: number;
    estado?: 'activa' | 'terminada' | 'buscando_ofertas' | 'en_progreso';
    creador?: Usuario;
}

interface TareaCardProps {
    tarea: Tarea;
    index?: number;
    variant?: 'owned' | 'external'; // Para distinguir tareas propias vs ajenas
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onApply?: (id: string) => void; // Para aplicar a tareas ajenas
}

const MotionCard = motion(Card);

export default function TareaCard({ 
    tarea, 
    index = 0, 
    variant = 'owned',
    onView, 
    onEdit, 
    onDelete,
    onApply 
}: TareaCardProps) {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const getEstadoColor = (estado?: string) => {
        switch (estado) {
            case 'activa':
            case 'buscando_ofertas':
                return '#1ADB1A';
            case 'en_progreso':
                return '#ff9800';
            case 'terminada':
                return '#757575';
            default:
                return '#1ADB1A';
        }
    };

    const getEstadoLabel = (estado?: string) => {
        switch (estado) {
            case 'activa':
                return 'Activa';
            case 'buscando_ofertas':
                return 'Buscando ofertas';
            case 'en_progreso':
                return 'En progreso';
            case 'terminada':
                return 'Terminada';
            default:
                return 'Activa';
        }
    };

    const cardClassName = variant === 'external' 
        ? `${estilos.tareaCard} ${estilos.externalCard}`
        : estilos.tareaCard;

    return (
        <MotionCard
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className={cardClassName}
        >
            <CardContent className={estilos.cardContent}>
                {/* Header con creador (solo para tareas externas) */}
                {variant === 'external' && tarea.creador && (
                    <Box className={estilos.creadorHeader}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar 
                                src={tarea.creador.profilePictureUrl} 
                                className={estilos.creadorAvatar}
                            >
                                <PersonIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle2" className={estilos.creadorNombre}>
                                    {tarea.creador.nombre} {tarea.creador.apellido}
                                </Typography>
                                <Typography variant="caption" className={estilos.creadorLabel}>
                                    Publicado por
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {/* Header principal */}
                <Box className={estilos.cardHeader}>
                    <Typography 
                        variant="h5" 
                        className={estilos.titulo}
                    >
                        {tarea.titulo}
                    </Typography>
                    
                    {/* Acciones según el variant */}
                    <Stack direction="row" spacing={1}>
                        {variant === 'owned' ? (
                            <>
                                {onView && (
                                    <IconButton 
                                        size="small" 
                                        className={estilos.actionButton}
                                        onClick={() => onView(tarea.id)}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                )}
                                {onEdit && (
                                    <IconButton 
                                        size="small" 
                                        className={estilos.actionButtonSecondary}
                                        onClick={() => onEdit(tarea.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                )}
                                {onDelete && (
                                    <IconButton 
                                        size="small" 
                                        className={estilos.actionButtonDanger}
                                        onClick={() => onDelete(tarea.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </>
                        ) : (
                            <>
                                {onView && (
                                    <IconButton 
                                        size="small" 
                                        className={estilos.actionButton}
                                        onClick={() => onView(tarea.id)}
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                )}
                            </>
                        )}
                    </Stack>
                </Box>

                <Typography 
                    variant="body1" 
                    className={estilos.descripcion}
                >
                    {tarea.descripcion}
                </Typography>

                <Box className={estilos.infoGrid}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <LocationIcon className={estilos.icon} />
                        <Typography variant="body2" color="text.secondary">
                            {tarea.ubicacion}
                        </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CalendarIcon className={estilos.icon} />
                        <Typography variant="body2" color="text.secondary">
                            {tarea.fechaDeseada}
                        </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ScheduleIcon className={estilos.icon} />
                        <Typography variant="body2" color="text.secondary">
                            {tarea.horarioDeseado}
                        </Typography>
                    </Stack>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <PeopleIcon className={estilos.icon} />
                        <Badge 
                            badgeContent={tarea.cantidadOfertas || 0} 
                            className={estilos.badge}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Ofertas
                            </Typography>
                        </Badge>
                    </Stack>
                </Box>

                <Divider className={estilos.divider} />

                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center"
                    className={estilos.footer}
                >
                    <Chip
                        icon={<MoneyIcon />}
                        label={`$${tarea.dineroOfrecido.toLocaleString()}`}
                        className={estilos.moneyChip}
                    />
                    
                    <Box className={estilos.chipGroup}>
                        {tarea.estado && (
                            <Chip
                                label={getEstadoLabel(tarea.estado)}
                                className={estilos.statusChip}
                                style={{ backgroundColor: getEstadoColor(tarea.estado) }}
                            />
                        )}
                        {variant === 'owned' ? (
                            <Chip
                                icon={<TrendingUpIcon />}
                                label={`${tarea.cantidadOfertas || 0} interesados`}
                                className={estilos.interestChip}
                            />
                        ) : (
                            onApply && (
                                <Button
                                    variant="contained"
                                    startIcon={<AssignmentIcon />}
                                    className={estilos.applyButton}
                                    onClick={() => onApply(tarea.id)}
                                    size="small"
                                >
                                    Postularme
                                </Button>
                            )
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </MotionCard>
    );
}