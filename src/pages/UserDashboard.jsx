import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './UserDashboard.css'
import Grid from '@mui/material/Grid';
import { Send, Calendar, Target, TrendingUp, Badge } from "lucide-react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { LinearProgress } from '@mui/material';
import Input from '@mui/material/Input';
import Chip from '@mui/material/Chip';
import { SendIcon } from 'lucide-react';

const UserDashboard = () => {
    return (
        <>
            <main className="user-dashboard-container">
                <h1>Mi Dashboard - Desarrollador</h1>
                <p className='text-muted-foreground grey'>Gestiona tus tareas y actualiza el progreso</p>

                {/* Stats Cards */}
                <Grid container gap={3} columns={3} sx={{ mt: 4 }}>
                    <Card sx={{
                        minWidth: {
                            xs: 200,
                            sm: 275,
                            md: 360
                        }
                    }}>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Puntos Planificados
                                </Typography>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className='stats-pts'><span>34</span> pts</p>
                            <p className="grey sprint-actual-p">Sprint actual</p>
                        </CardContent>
                    </Card>

                    <Card sx={{
                        minWidth: {
                            xs: 200,
                            sm: 275,
                            md: 360
                        }
                    }}>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Puntos Completados
                                </Typography>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className='stats-pts'><span>21</span> pts</p>
                            <p className="grey sprint-actual-p"> <span>62</span>% del objetivo</p>
                        </CardContent>
                    </Card>

                    {/* <Card sx={{ minWidth: 360 }}> */}
                    <Card sx={{
                        minWidth: {
                            xs: 200,
                            sm: 275,
                            md: 360
                        }
                    }}>
                        <CardContent>
                            <div className="card-header">
                                <Typography gutterBottom sx={{ fontSize: 17 }}>
                                    Días Restantes
                                </Typography>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className='stats-pts'><span>5</span> días</p>
                            <p className="grey sprint-actual-p">Hasta fin de sprint</p>
                        </CardContent>
                    </Card>
                    {/* </div> */}
                </Grid>

                {/* Active Sprint */}
                <Card sx={{ mt: 4, py: 2.7, px: 2 }}>
                    <div className="header-sprint">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                        <div>
                            <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Sprint 24</Typography>
                            <p className='grey'> <span className="start-date">2025-10-06</span> <span className="finish-date">2025-10-20</span> </p>
                        </div>
                        <Chip label="En curso" color='primary' />
                    </Box>
                    </div>
                    <Box sx={{ mt: 3 }}>
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Progreso general del sprint
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: "100%" }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={56}
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
                            <Typography variant="body2" sx={{ minWidth: 40, textAlign: "right" }}>
                                <span>56</span> %
                            </Typography>
                        </Box>
                    </Box>

                    <h3 className='user-history-title'>Mis historias de Usuario</h3>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Historia</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Planificado</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Completado</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Estado</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <p>US-1</p>
                                            <p className='grey'>Implementar login usuarios</p>
                                        </Box>
                                    </TableCell>
                                    <TableCell><span>8</span> pts</TableCell>
                                    <TableCell>
                                        <Input type='number' defaultValue={8} min={0} max={10} sx={{
                                            width: '5rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem', padding: '0.2rem 0.5rem', border: '1px solid #ccc', 
                                            '& input': {
                                                borderRadius: '0.25rem', 
                                                padding: '0.2rem 0.5rem'
                                            }
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Completado"
                                            color="success"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <p>US-2</p>
                                            <p className='grey'>Crear dashboard principal</p>
                                        </Box>
                                    </TableCell>
                                    <TableCell><span>13</span> pts</TableCell>
                                    <TableCell>
                                        <Input type='number' defaultValue={8} min={0} max={10} sx={{
                                            width: '5rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem', padding: '0.2rem 0.5rem', border: '1px solid #ccc', 
                                            '& input': {
                                                borderRadius: '0.25rem', 
                                                padding: '0.2rem 0.5rem'
                                            }
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="En progreso"
                                            color="warning"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>
                                        <Box>
                                            <p>US-3</p>
                                            <p className='grey'>Integrar API de pagos</p>
                                        </Box>
                                    </TableCell>
                                    <TableCell><span>5</span> pts</TableCell>
                                    <TableCell>
                                        <Input type='number' defaultValue={0} min={0} max={10} sx={{
                                            width: '5rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem', padding: '0.2rem 0.5rem', border: '1px solid #ccc',
                                            '& input': {
                                                borderRadius: '0.25rem', 
                                                padding: '0.2rem 0.5rem'
                                            }
                                        }} />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label="Pendiente"
                                            color="outilined"
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell><strong>Total</strong></TableCell>
                                    <TableCell><strong><span>26</span> pts</strong></TableCell>
                                    <TableCell><strong><span>16</span> pts</strong></TableCell>
                                    <TableCell><Chip label="62%" color='outlined' size='small' /></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
                        <Button variant='"outline' >Ver resultados</Button>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                        >
                            Guardar progreso
                        </Button>
                    </Box>
                </Card>

                {/* Sprint History */}
                <Card sx={{ mt: 4, py: 2.7, px: 2 }}>
                    <div className="header-sprint-history">
                        <Typography variant='h4' sx={{ fontSize: 17, fontWeight: 600 }}>Historial de Sprints</Typography>
                        <p className="grey">Sprints anteriores completados</p>
                    </div>

                    <TableContainer sx={{ mt: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Sprint</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Planificado</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Completado</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Cumplimiento</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <TableRow>
                                    <TableCell>Sprint 23</TableCell>
                                    <TableCell><span>32</span> pts</TableCell>
                                    <TableCell><span>30</span> pts</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box sx={{ width: "40%" }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={94}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 5,
                                                        "& .MuiLinearProgress-bar": {
                                                            backgroundColor: "#1e40af",
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <p><span>94</span> %</p>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost"
                                            size="sm"
                                        >Ver detalle</Button>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Sprint 22</TableCell>
                                    <TableCell><span>28</span> pts</TableCell>
                                    <TableCell><span>28</span> pts</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Box sx={{ width: "40%" }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={100}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 5,
                                                        "& .MuiLinearProgress-bar": {
                                                            backgroundColor: "#1e40af", 
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <p><span>100</span> %</p>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost"
                                            size="sm"
                                        >Ver detalle</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </main>
        </>
    )
}

export default UserDashboard