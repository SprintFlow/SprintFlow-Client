import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './UserDashboard.css'
import Grid from '@mui/material/Grid';
import { Calendar, Target, TrendingUp, Clock } from "lucide-react";
import { LinearProgress } from '@mui/material';
import Chip from '@mui/material/Chip';
import { Divider } from "@mui/material";

const UserDashboard = () => {
    return (
        <>
            <Card component='main' sx={{ bgcolor: 'white', color: 'black', textAlign: 'justify', borderRadius: '10px', p: '5% 3%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box >
                        <Typography variant='h5'>Mi Dashboard - Desarrollador</Typography>
                        <Typography sx={{ color: 'grey' }}> Bienvenido, <span>Carlos Ruiz</span></Typography>
                    </Box>
                    <Button variant='contained' size='small' sx={{
                        bgcolor: 'black', color: 'white', fontSize: '0.75rem',
                        padding: '2px 10px',
                        minWidth: 'auto'
                    }}>Registrar puntos</Button>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3}
                    sx={{
                        mt: 4,
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(2, 1fr)',  // 2 columnas en móvil
                            md: 'repeat(4, 1fr)'   // 4 columnas en pantallas >= 768px
                        },
                        gap: 3
                    }}>
                    {/* Sprint actual */}
                    <Card>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Sprint actual
                                </Typography>
                                <Target style={{ color: '#9e9e9e'}} />
                            </div>
                            <Typography sx={{ mt: '30px', fontSize: '35px' }}>1</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>En progreso</Typography>
                        </CardContent>
                    </Card>

                    {/* Mis Puntos (Sprint) */}
                    <Card>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Mis Puntos (Sprint)
                                </Typography>
                                <TrendingUp style={{ color: '#9e9e9e'}} />
                            </div>
                            <Typography sx={{ mt: '30px', fontSize: '35px' }}>7.0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>Este sprint</Typography>
                        </CardContent>
                    </Card>

                    {/* Puntos Totales  */}
                    <Card>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Puntos Totales
                                </Typography>
                                <Calendar style={{ color: '#9e9e9e'}} />
                            </div>
                            <Typography sx={{ mt: '30px', fontSize: '35px' }}>7.0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>Todos los sprints</Typography>
                        </CardContent>
                    </Card>

                    {/* Días Restantes  */}
                    <Card>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Días Restantes
                                </Typography>
                                <Clock style={{ color: '#9e9e9e'}}></Clock>
                            </div>
                            <Typography sx={{ mt: '30px', fontSize: '35px' }}>0</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>Para finalizar sprint</Typography>
                        </CardContent>
                    </Card>
                    {/* </div> */}
                </Grid>

                {/* Active Sprint */}
                <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Sprint Activo</Typography>
                        <Chip label="Activo" sx={{ color: 'white', backgroundColor: 'black' }} />
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography>Sprint 2- Enero 2025</Typography>
                            <Button variant='outlined' >Ver Detalle</Button>
                        </Box>
                        <Typography sx={{ color: 'grey.600', fontSize: 14, mt: 0.5 }}><span>2025-01-13</span>  -  <span>2025-01-17</span> <span>(5 días)</span></Typography>
                    </Box>

                    {/* Progreso del equipo - Sprint Activo  */}
                    <Box sx={{ mt: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                Progreso del Equipo
                            </Typography>
                            <Typography variant='body2'><span>14.0</span> / <span>64.5</span> puntos</Typography>
                        </Box>

                        <Box sx={{ width: "100%" }}>
                            <LinearProgress
                                variant="determinate"
                                value={21}
                                sx={{
                                    height: 8,
                                    borderRadius: 5,
                                    backgroundColor: "#e5e7eb",
                                    "& .MuiLinearProgress-bar": {
                                        backgroundColor: "#1e40af",
                                    },
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 40, textAlign: "justify", mt: 1 }}>
                            <span>21.7</span> %
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box elevation={1} sx={{ mx: "auto", backgroundColor: "transparent" }}>
                        {/* Puntos */}
                        <Grid container spacing={6} sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            alignItems: "center",
                            textAlign: "justify",
                            gap: 0,
                        }}>
                            <Grid item xs={6} >
                                <Typography variant="subtitle2" color="text.secondary">
                                    Mis Puntos
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28 }}>
                                    7.0
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Equipo Total
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: "bold", fontSize: 28 }}>
                                    14.0
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        {/* Observaciones */}
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ mb: 0.5 }}
                            >
                                Observaciones:
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 14 }}>
                                Sprint enfocado en features del producto principal.
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                {/* My Recent Records */}
                <Card sx={{ mt: 4, py: 2.7, px: 2, borderRadius: 3 }}>
                    <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Mis Registros</Typography>
                    <Box sx={{
                        my: 2, p: 2, borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "background.default"
                    }}>
                        <Typography><span>2</span> historia(s) de <span>1</span> punto(s)</Typography>
                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>14 de enero</Typography>
                    </Box>
                    <Box sx={{
                        my: 2, p: 2, borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "background.default"
                    }}>
                        <Typography><span>1</span> historia(s) de <span>5</span> punto(s)</Typography>
                        <Typography component="span" sx={{ color: 'grey', fontSize: '14px' }}>15 de enero</Typography>
                    </Box>
                </Card>
            </Card>
        </>
    )
}

export default UserDashboard