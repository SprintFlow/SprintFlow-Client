import {
    Box,
    Container,
    Typography,
    Avatar,
    Stack,
    IconButton,
    Grid,
    useTheme,
    useMediaQuery
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { keyframes } from "@emotion/react";
import { useThemeContext } from "../theme/useThemeContext";
import SprintFlowLogo from "../components/SprintFlowLogo";

// Importar imágenes
import adayImage from "../../public/aday.jpg";
import palomaImage from "../../public/paloma.jpg";
import valentinaImage from "../../public/valentina.jpg";
import guissellaImage from "../../public/guissella.jpeg";
import sofiaImage from "../../public/sofia.jpg";
import carmenImage from "../../public/carmen.jpg";

// Floating animation for main avatar
const floatAnimation = keyframes`
  0% { transform: translateY(-10px) rotate(-5deg); }
  50% { transform: translateY(0px) rotate(5deg); }
  100% { transform: translateY(-10px) rotate(-5deg); }
`;

const CreatorsPage = () => {
    const theme = useTheme();
    const { darkMode } = useThemeContext();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Colors that adapt to dark mode
    const backgroundColor = darkMode
        ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
        : "linear-gradient(135deg, #e6f2ed 0%, #f0f8ff 100%)";

    const cardBackground = darkMode ? "#2d2d2d" : "#a3cfbbff";
    const textColor = darkMode ? "white" : "text.primary";
    const secondaryTextColor = darkMode ? "grey.400" : "text.secondary";

    // Creators data with imported images
    const creators = [
        {
            name: "Aday Álvarez",
            github: "https://github.com/Aday25",
            linkedin: "https://www.linkedin.com/in/adayasc/",
            avatar: adayImage  // ✅ Usando import
        },
        {
            name: "Paloma Gómez",
            github: "https://github.com/Pal-cloud",
            linkedin: "https://www.linkedin.com/in/palomagsal/",
            avatar: palomaImage  // ✅ Usando import
        },
        {
            name: "Valentina Montilla",
            github: "https://github.com/ValenMontilla7",
            linkedin: "https://www.linkedin.com/in/valentina-montilla-493a7b380/",
            avatar: valentinaImage  // ✅ Usando import
        },
        {
            name: "Guissella Pérez",
            github: "https://github.com/guiss26",
            linkedin: "https://www.linkedin.com/in/guissella-p%C3%A9rez/",
            avatar: guissellaImage  // ✅ Usando import
        },
        {
            name: "Sofía Reyes",
            github: "https://github.com/Sofiareyes12",
            linkedin: "https://www.linkedin.com/in/sofiareyes12/",
            avatar: sofiaImage  // ✅ Usando import
        },
        {
            name: "Carmen Tajuelo",
            github: "https://github.com/CarmenTajuelo",
            linkedin: "https://www.linkedin.com/in/carmentajuelo/",
            avatar: carmenImage  // ✅ Usando import
        }
    ];

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 120px)",
                background: backgroundColor,
                py: 4,
                px: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Container maxWidth="xl" sx={{ py: 2 }}>
                {/* Header Section - Título encima del contenido */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                        textAlign: "center"
                    }}
                >

                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            background: "linear-gradient(45deg, #7ca87dff, #20bb25ff)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent"
                        }}
                    >
                        Nuestro Equipo
                    </Typography>
                </Box>

                {/* Main Content - Logo a la izquierda, cards a la derecha */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 6,
                        flexDirection: isMobile ? "column" : "row"
                    }}
                >
                    {/* Logo on the left */}
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}
                    >
                        <SprintFlowLogo
                            size={isMobile ? 250 : 400}
                            textColor={darkMode ? "white" : "#1f2937"}
                        />
                    </Box>

                    {/* Cards grid on the right - 3 PER ROW, 2 ROWS */}
                    <Box sx={{ flex: 2 }}>
                        <Grid container spacing={3} justifyContent="center" >
                            {creators.map((creator, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            p: 3,
                                            borderRadius: 3,
                                            background: cardBackground,
                                            boxShadow: darkMode
                                                ? "0 8px 32px rgba(0,0,0,0.3)"
                                                : "0 8px 32px rgba(0,0,0,0.1)",
                                            transition: "all 0.3s ease",
                                            border: darkMode ? "1px solid #444" : "none",
                                            width: "220px",
                                            height: "160px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            "&:hover": {
                                                transform: "translateY(-5px)",
                                                boxShadow: darkMode
                                                    ? "0 12px 40px rgba(0,0,0,0.4)"
                                                    : "0 12px 40px rgba(0,0,0,0.15)"
                                            }
                                        }}
                                    >
                                        {/* Avatar */}
                                        <Avatar
                                            src={creator.avatar}
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                border: "2px solid #FFD700",
                                                bgcolor: "#FFF9C4",
                                                mt: 0.2
                                            }}
                                        >
                                            {creator.name.split(' ')[0][0]}
                                        </Avatar>

                                        {/* Name - FIXED HEIGHT */}
                                        <Box sx={{
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%'
                                        }}>
                                            <Typography
                                                variant="subtitle1"
                                                component="h3"
                                                sx={{
                                                    fontWeight: "bold",
                                                    color: textColor,
                                                    textAlign: "center",
                                                    lineHeight: 2,
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {creator.name}
                                            </Typography>
                                        </Box>

                                        {/* Social links */}
                                        <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 0.5 }}>
                                            <IconButton
                                                href={creator.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                sx={{
                                                    color: darkMode ? "#f0f0f0" : "#333",
                                                    "&:hover": {
                                                        color: darkMode ? "white" : "#000",
                                                        bgcolor: darkMode
                                                            ? "rgba(255,255,255,0.1)"
                                                            : "rgba(0,0,0,0.04)"
                                                    }
                                                }}
                                            >
                                                <GitHubIcon fontSize="small" />
                                            </IconButton>

                                            <IconButton
                                                href={creator.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                size="small"
                                                sx={{
                                                    color: "#0077b5",
                                                    "&:hover": {
                                                        color: "#005582",
                                                        bgcolor: darkMode
                                                            ? "rgba(0, 119, 181, 0.1)"
                                                            : "rgba(0, 119, 181, 0.04)"
                                                    }
                                                }}
                                            >
                                                <LinkedInIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Footer text */}
                <Box sx={{ textAlign: "center", mt: 6 }}>
                    <Typography
                        variant="body1"
                        color={secondaryTextColor}
                    >
                        Seis desarrolladoras con ganas de innovar y aportar soluciones.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default CreatorsPage;