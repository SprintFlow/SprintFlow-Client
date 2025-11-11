import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Button,
    Stack,
    Avatar,
    Alert,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import useAuthStore from "../store/authStore";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const { forgotPassword, verifySecurityAnswer, resetPassword } = useAuthStore();

    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const steps = ['Verificar email', 'Responder pregunta', 'Nueva contraseña'];

    const handleStep1 = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const result = await forgotPassword(email);

            if (result.success) {
                setSecurityQuestion(result.securityQuestion);
                setActiveStep(1);
                setMessage("");
            } else {
                setError("Email no encontrado en el sistema");
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2 = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await verifySecurityAnswer(email, securityAnswer);

            if (result.success) {
                setActiveStep(2);
                setError("");
            } else {
                setError("Respuesta incorrecta. Intenta nuevamente.");
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3 = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validar contraseñas
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            setIsLoading(false);
            return;
        }

        try {
            const result = await resetPassword(email, newPassword);

            if (result.success) {
                setMessage("Contraseña cambiada exitosamente. Redirigiendo al login...");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                setError(result.error || "Error al cambiar la contraseña");
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const greenS = "#4CAF50";
    const backgroundMint = "#e6f2ed";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: backgroundMint,
                p: 2,
            }}
        >
            <LoadingOverlay open={isLoading} />

            <Card sx={{ width: "100%", maxWidth: 500, boxShadow: 6 }}>
                <CardHeader
                    sx={{ textAlign: "center", pb: 0 }}
                    title={
                        <Stack alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: greenS, width: 56, height: 56 }}>
                                <TrackChangesIcon sx={{ fontSize: 32 }} />
                            </Avatar>
                            <Typography variant="h4" component="h1" color="text.primary">
                                Recuperar Contraseña
                            </Typography>
                        </Stack>
                    }
                />
                <CardContent>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <form onSubmit={
                        activeStep === 0 ? handleStep1 :
                            activeStep === 1 ? handleStep2 :
                                handleStep3
                    }>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {message && (
                                <Alert severity="success" sx={{ width: "100%" }}>
                                    {message}
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ width: "100%" }}>
                                    {error}
                                </Alert>
                            )}

                            {/* Paso 1: Email */}
                            {activeStep === 0 && (
                                <>
                                    <Typography variant="body1" color="text.secondary" align="center">
                                        Ingresa tu email para verificar tu identidad
                                    </Typography>
                                    <TextField
                                        label="Correo electrónico"
                                        type="email"
                                        placeholder="nombre@cohispania.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        fullWidth
                                    />
                                </>
                            )}

                            {/* Paso 2: Pregunta de seguridad */}
                            {activeStep === 1 && (
                                <>
                                    <Typography variant="body1" color="text.secondary" align="center">
                                        Responde tu pregunta de seguridad
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        align="center"
                                        sx={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                            p: 2,
                                            borderRadius: 1,
                                            border: '1px solid',
                                            borderColor: 'primary.light'
                                        }}
                                    >
                                        {securityQuestion}
                                    </Typography>
                                    <TextField
                                        label="Tu respuesta"
                                        type="text"
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        fullWidth
                                        placeholder="Escribe tu respuesta aquí"
                                    />
                                </>
                            )}

                            {/* Paso 3: Nueva contraseña */}
                            {activeStep === 2 && (
                                <>
                                    <Typography variant="body1" color="text.secondary" align="center">
                                        Crea tu nueva contraseña
                                    </Typography>
                                    <TextField
                                        label="Nueva contraseña"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        fullWidth
                                        helperText="Mínimo 6 caracteres"
                                    />
                                    <TextField
                                        label="Confirmar contraseña"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        fullWidth
                                    />
                                </>
                            )}

                            <Stack spacing={1.5} sx={{ pt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    disabled={isLoading ||
                                        (activeStep === 0 && !email) ||
                                        (activeStep === 1 && !securityAnswer) ||
                                        (activeStep === 2 && (!newPassword || !confirmPassword))
                                    }
                                    sx={{
                                        backgroundColor: greenS,
                                        "&:hover": { backgroundColor: "#45A049" },
                                    }}
                                >
                                    {isLoading ? "Procesando..." :
                                        activeStep === 0 ? "Continuar" : // Cambiado de "Verificar email"
                                            activeStep === 1 ? "Verificar respuesta" :
                                                "Cambiar contraseña"}
                                </Button>

                                <Button
                                    startIcon={<ArrowBackIcon />}
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => {
                                        if (activeStep === 0) {
                                            navigate("/");
                                        } else {
                                            setActiveStep(activeStep - 1);
                                            setError("");
                                            setMessage("");
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    {activeStep === 0 ? "Volver al login" : "Atrás"}
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}