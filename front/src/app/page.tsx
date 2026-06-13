"use client";

import Image from 'next/image';
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Stack, 
    Paper,
    Card,
    CardContent,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Security as SecurityIcon,
    Verified as VerifiedIcon,
    Shield as ShieldIcon,
    Work as WorkIcon,
    TrendingUp as TrendingUpIcon,
    Schedule as ScheduleIcon,
    Group as GroupIcon,
    Star as StarIcon,
    ArrowForward as ArrowIcon,
    CheckCircle as CheckIcon,
    AttachMoney as MoneyIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './inicio.module.css';

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);

// Hook para detectar cuando un elemento está en vista
function useScrollAnimation() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    return { ref, isInView };
}

export default function Home() {
    const heroRef = useScrollAnimation();
    const featuresRef = useScrollAnimation();
    const workersRef = useScrollAnimation();
    const bossRef = useScrollAnimation();

    // Variantes de animación
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.8, rotate: -5 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    const staggerListVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const listItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4, ease: "easeOut" as const }
        }
    };

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <motion.div
                ref={heroRef.ref}
                initial="hidden"
                animate={heroRef.isInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <Container maxWidth="xl" className={styles.heroContainer}>
                    <Box className={styles.heroContent}>
                        <MotionBox 
                            variants={itemVariants}
                            className={styles.heroText}
                        >
                                  <MotionBox
                                    variants={itemVariants}
                                    className={styles.heroTitle}
                                  >
                                    <Image
                                      src="/logo_verde_clarito.svg"   
                                      alt="Dinamango"
                                      width={700}                   
                                      height={120}                 
                                      priority
                                      className={styles.heroLogo}
                                    />
                                  </MotionBox>
                            <MotionTypography 
                                variant="h4" 
                                className={styles.heroSubtitle}
                                variants={itemVariants}
                            >
                                La plataforma que conecta necesidades con soluciones
                            </MotionTypography>

                            <MotionBox 
                                variants={itemVariants}
                                className={styles.heroDescription}
                            >
                                <Typography variant="h6" className={styles.heroDescText}>
                                    Dinamango asegura las mejores condiciones para que puedas resolver problemas con facilidad
                                </Typography>
                            </MotionBox>

                            <MotionButton
                                variant="contained"
                                size="large"
                                className={styles.ctaButton}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <StarIcon sx={{ mr: 1 }} />
                                ME INTERESA
                                <ArrowIcon sx={{ ml: 1 }} />
                            </MotionButton>
                        </MotionBox>

                        <MotionBox 
                            variants={imageVariants}
                            className={styles.heroImageContainer}
                        >
                            <Box className={styles.imageWrapper}>
                                <Image
                                    src="/img/1raHome.png"
                                    alt="Negociación"
                                    width={600}
                                    height={600}
                                    className={styles.heroImage}
                                    priority
                                />
                                <Box className={styles.floatingElements}>
                                    <motion.div
                                        animate={{ 
                                            y: [0, -10, 0],
                                            rotate: [0, 5, 0]
                                        }}
                                        transition={{ 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={styles.floatingElement1}
                                    >
                                        <Chip 
                                            icon={<CheckIcon />} 
                                            label="100% Seguro" 
                                            className={styles.floatingChip}
                                        />
                                    </motion.div>
                                    <motion.div
                                        animate={{ 
                                            y: [0, 10, 0],
                                            rotate: [0, -5, 0]
                                        }}
                                        transition={{ 
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1
                                        }}
                                        className={styles.floatingElement2}
                                    >
                                        <Chip 
                                            icon={<MoneyIcon />} 
                                            label="Pagos seguros" 
                                            className={styles.floatingChip}
                                        />
                                    </motion.div>
                                </Box>
                            </Box>
                        </MotionBox>
                    </Box>
                </Container>
            </motion.div>

            {/* Features Section */}
            <motion.div
                ref={featuresRef.ref}
                initial="hidden"
                animate={featuresRef.isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className={styles.featuresSection}
            >
                <Container maxWidth="xl">
                    <MotionTypography 
                        variant="h3" 
                        className={styles.sectionTitle}
                        variants={itemVariants}
                    >
                        ¿Por qué elegir Dinamango?
                    </MotionTypography>

                    <Box className={styles.featuresGrid}>
                        <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                                gap: 4 
                            }}
                        >
                        {[
                            {
                                icon: <SecurityIcon />,
                                title: "Pagos Seguros",
                                description: "Todas las transacciones son 100% seguras con nuestra plataforma de pagos",
                                color: "#1ADB1A"
                            },
                            {
                                icon: <VerifiedIcon />,
                                title: "Experiencia Verificada",
                                description: "Experiencia y confianza comprobable para realizar cada tarea",
                                color: "#00BCD4"
                            },
                            {
                                icon: <ShieldIcon />,
                                title: "Seguro Incluido",
                                description: "Contrata seguro para tener cubierta cualquier eventualidad",
                                color: "#FF9800"
                            }
                        ].map((feature, index) => (
                            <MotionCard
                                key={index}
                                variants={itemVariants}
                                className={styles.featureCard}
                                whileHover={{ 
                                    scale: 1.05,
                                    rotateY: 5,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <CardContent className={styles.featureContent}>
                                    <Avatar 
                                        className={styles.featureIcon}
                                        style={{ backgroundColor: feature.color }}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <Typography variant="h5" className={styles.featureTitle}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body1" className={styles.featureDescription}>
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </MotionCard>
                        ))}
                    </Box>
                    </Box>
                </Container>
            </motion.div>

            <motion.div
                ref={workersRef.ref}
                initial="hidden"
                animate={workersRef.isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className={styles.workersSection}
            >
                <Container maxWidth="xl">
                    <Box className={styles.sectionContent}>
                        <MotionBox 
                            variants={imageVariants}
                            className={styles.sectionImageContainer}
                        >
                            <Image
                                src="/img/2daHome.avif"
                                alt="Trabajadores"
                                width={500}
                                height={500}
                                className={styles.sectionImage}
                            />
                        </MotionBox>

                        <MotionBox 
                            variants={itemVariants}
                            className={styles.sectionTextContainer}
                        >
                            <Typography variant="h3" className={styles.sectionMainTitle}>
                                Tu próxima oportunidad, con seguridad y confianza
                            </Typography>

                            <motion.div variants={staggerListVariants}>
                                <List className={styles.benefitsList}>
                                    {[
                                        {
                                            icon: <SecurityIcon />,
                                            primary: "Plataforma de pagos segura",
                                            secondary: "Todas las transacciones hechas con Dinamango son 100% seguras"
                                        },
                                        {
                                            icon: <VerifiedIcon />,
                                            primary: "Confía en quien contratas",
                                            secondary: "Encontra a la persona apropiada para tu tarea"
                                        },
                                        {
                                            icon: <StarIcon />,
                                            primary: "Experiencia visible",
                                            secondary: "Ve las tareas y experiencia completa de cada perfil"
                                        },
                                        {
                                            icon: <ShieldIcon />,
                                            primary: "Seguro disponible",
                                            secondary: "Contrata seguro para tener cubierta cualquier eventualidad"
                                        }
                                    ].map((benefit, index) => (
                                        <motion.div key={index} variants={listItemVariants}>
                                            <ListItem className={styles.benefitItem}>
                                                <ListItemIcon className={styles.benefitIcon}>
                                                    <Avatar className={styles.benefitAvatar}>
                                                        {benefit.icon}
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6" className={styles.benefitPrimary}>
                                                            {benefit.primary}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body1" className={styles.benefitSecondary}>
                                                            {benefit.secondary}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            </motion.div>

                            <MotionButton
                                variant="contained"
                                size="large"
                                className={styles.sectionButton}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <WorkIcon sx={{ mr: 1 }} />
                                PUBLICA TU PROYECTO
                                <ArrowIcon sx={{ ml: 1 }} />
                            </MotionButton>
                        </MotionBox>
                    </Box>
                </Container>
            </motion.div>

            {/* Boss Section */}
            <motion.div
                ref={bossRef.ref}
                initial="hidden"
                animate={bossRef.isInView ? "visible" : "hidden"}
                variants={containerVariants}
                className={styles.bossSection}
            >
                <Container maxWidth="xl">
                    <Box className={styles.sectionContent}>
                        <MotionBox 
                            variants={itemVariants}
                            className={styles.sectionTextContainer}
                        >
                            <Typography variant="h3" className={styles.sectionMainTitle}>
                                Sé tu propio jefe
                            </Typography>

                            <Typography variant="h6" className={styles.sectionSubtitle}>
                                Encuentra tu próxima aventura profesional con Dinamango
                            </Typography>

                            <motion.div variants={staggerListVariants}>
                                <List className={styles.benefitsList}>
                                    {[
                                        {
                                            icon: <WorkIcon />,
                                            primary: "Para todos los profesionales",
                                            secondary: "Seas carpintero experto o un oficinista aplicado, encuentra tu próxima aventura"
                                        },
                                        {
                                            icon: <BusinessIcon />,
                                            primary: "Miles de oportunidades",
                                            secondary: "Acceso a miles de empleos y proyectos diversos"
                                        },
                                        {
                                            icon: <MoneyIcon />,
                                            primary: "Sin comisiones ocultas",
                                            secondary: "Sin suscripciones o movimientos fuera de la aplicación"
                                        },
                                        {
                                            icon: <ScheduleIcon />,
                                            primary: "Horarios flexibles",
                                            secondary: "Gana dinero extra en una agenda que se adapte a ti"
                                        },
                                        {
                                            icon: <TrendingUpIcon />,
                                            primary: "Crecimiento profesional",
                                            secondary: "Crece laboralmente y mejora tu red de contactos"
                                        }
                                    ].map((benefit, index) => (
                                        <motion.div key={index} variants={listItemVariants}>
                                            <ListItem className={styles.benefitItem}>
                                                <ListItemIcon className={styles.benefitIcon}>
                                                    <Avatar className={styles.benefitAvatar}>
                                                        {benefit.icon}
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="h6" className={styles.benefitPrimary}>
                                                            {benefit.primary}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="body1" className={styles.benefitSecondary}>
                                                            {benefit.secondary}
                                                        </Typography>
                                                    }
                                                />
                                            </ListItem>
                                        </motion.div>
                                    ))}
                                </List>
                            </motion.div>

                            <MotionButton
                                variant="contained"
                                size="large"
                                className={styles.sectionButtonSecondary}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <GroupIcon sx={{ mr: 1 }} />
                                GANA CON DINAMANGO
                                <ArrowIcon sx={{ ml: 1 }} />
                            </MotionButton>
                        </MotionBox>

                        <MotionBox 
                            variants={imageVariants}
                            className={styles.sectionImageContainer}
                        >
                            <Image
                                src="/img/3raHome.png"
                                alt="Planificación"
                                width={1080}
                                height={720}
                                className={styles.sectionImage}
                            />
                        </MotionBox>
                    </Box>
                </Container>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.statsSection}
            >
                <Container maxWidth="lg">
                    <Paper className={styles.statsPaper}>
                        <Box 
                            sx={{ 
                                display: 'grid',
                                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                                gap: 4 
                            }}
                        >
                            {[
                                { number: "10K+", label: "Tareas completadas", icon: <CheckIcon /> },
                                { number: "5K+", label: "Profesionales activos", icon: <GroupIcon /> },
                                { number: "98%", label: "Satisfacción", icon: <StarIcon /> },
                                { number: "24/7", label: "Soporte", icon: <SecurityIcon /> }
                            ].map((stat, index) => (
                                <MotionBox
                                    key={index}
                                    variants={itemVariants}
                                    className={styles.statItem}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Avatar className={styles.statIcon}>
                                        {stat.icon}
                                    </Avatar>
                                    <Typography variant="h4" className={styles.statNumber}>
                                        {stat.number}
                                    </Typography>
                                    <Typography variant="body1" className={styles.statLabel}>
                                        {stat.label}
                                    </Typography>
                                </MotionBox>
                            ))}
                        </Box>
                    </Paper>
                </Container>
            </motion.div>

            {/* CTA Final */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={styles.finalCta}
            >
                <Container maxWidth="md">
                    <MotionCard
                        variants={itemVariants}
                        className={styles.ctaCard}
                        whileHover={{ scale: 1.02 }}
                    >
                        <CardContent className={styles.ctaContent}>
                            <Typography variant="h4" className={styles.ctaTitle}>
                                ¿Listo para comenzar?
                            </Typography>
                            <Typography variant="h6" className={styles.ctaSubtitle}>
                                Únete a miles de personas que ya confían en Dinamango
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className={styles.ctaButtons}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    className={styles.ctaPrimary}
                                >
                                    Publicar Tarea
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    className={styles.ctaSecondary}
                                >
                                    Buscar Trabajo
                                </Button>
                            </Stack>
                        </CardContent>
                    </MotionCard>
                </Container>
            </motion.div>
        </main>
    );
}