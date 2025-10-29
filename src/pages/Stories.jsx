import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextField, Chip, IconButton } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStories, deleteStory } from '../services/StoriesServices';

const __DEV_DEBUG = true; // ponlo en false cuando ya funcione

// Intenta desempaquetar respuestas tipo Axios/fetch con distintas capas { data: ... }
const unwrapPayload = (raw) => {
  // Nivel 1: axios
  let out = raw?.data ?? raw;
  // Nivel 2: algunos backends devuelven { data: { ... } }
  out = out?.data ?? out;
  return out;
};

// Hidrata stories con referencias de users y sprints
const hydrateStories = (storiesArr, usersArr = [], sprintsArr = []) => {
  const storiesSafe = Array.isArray(storiesArr) ? storiesArr : [];
  const userById = new Map((usersArr || []).map(u => [String(u.id), u]));
  const sprintById = new Map((sprintsArr || []).map(s => [String(s.id), s]));

  return storiesSafe.map(st => ({
    ...st,
    points: st.points !== undefined ? Number(st.points) : 0,
    user: st.user || userById.get(String(st.userId)) || null,
    sprint: st.sprint || sprintById.get(String(st.sprintId)) || null,
  }));
};

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [debugInfo, setDebugInfo] = useState({ raw: null, payload: null });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const raw = await getStories();
        const payload = unwrapPayload(raw);

        if (__DEV_DEBUG) {
          setDebugInfo({ raw, payload });
          console.log('[Stories] raw:', raw);
          console.log('[Stories] payload:', payload);
        }

        // Caso A: { stories, users, sprints }
        if (payload && typeof payload === 'object' && !Array.isArray(payload) && payload.stories) {
          const us = Array.isArray(payload.users) ? payload.users : [];
          const sp = Array.isArray(payload.sprints) ? payload.sprints : [];
          setUsers(us);
          setSprints(sp);
          setStories(hydrateStories(payload.stories, us, sp));
          return;
        }

        // Caso B: el servicio devuelve un array de historias directamente
        if (Array.isArray(payload)) {
          setUsers([]);
          setSprints([]);
          setStories(hydrateStories(payload, [], []));
          return;
        }

        // Caso C: la API vino envuelta con alguna clave distinta (p.ej. { result: { stories, ... } })
        const maybe = payload?.result || payload?.items || payload?.payload || null;
        if (maybe?.stories) {
          const us = Array.isArray(maybe.users) ? maybe.users : [];
          const sp = Array.isArray(maybe.sprints) ? maybe.sprints : [];
          setUsers(us);
          setSprints(sp);
          setStories(hydrateStories(maybe.stories, us, sp));
          return;
        }

        // Si nada coincide, deja todo vacío para mostrar el aviso
        setUsers([]);
        setSprints([]);
        setStories([]);
      } catch (error) {
        console.error("Error al obtener historias: ", error);
        setStories([]); setUsers([]); setSprints([]);
      }
    };

    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteStory(id);
      setStories(prev => prev.filter(story => String(story.id) !== String(id)));
    } catch (error) {
      console.error("Error eliminando historia:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return { bg: '#BBF7D0', color: '#065F46' };
      case 'En progreso': return { bg: '#FEF9C3', color: '#854D0E' };
      case 'Pendiente': return { bg: '#E5E7EB', color: '#374151' };
      default: return { bg: '#E5E7EB', color: '#374151' };
    }
  };

  // Para selects: memoriza las opciones (evita renders innecesarios)
  const sprintOptions = useMemo(() => sprints ?? [], [sprints]);
  const userOptions = useMemo(() => users ?? [], [users]);

  return (
    <>
      <Box sx={{ p: 4, display: 'flex', width: '100%', justifyContent: 'space-between', gap: 2 }}>
        {/** Form */}
        <Card sx={{ width: '37%', p: 2, borderRadius: 3, boxShadow: 3, textAlign: 'justify' }}>
          <CardContent>
            <Typography sx={{ mb: 3, fontSize: '20px', fontWeight: 'bold' }}>Nueva Historia</Typography>

            <Box component="form" display="flex" flexDirection="column" gap={2}>
              {/* Title */}
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Título</Typography>
                <TextField
                  name="title"
                  placeholder='Descripción'
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Box>

              {/* Points */}
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Puntos</Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  placeholder="Seleccione puntuación"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Seleccione puntuación</em>
                  </MenuItem>
                  <MenuItem value={0.5}>0.5</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={13}>13</MenuItem>
                  <MenuItem value={21}>21</MenuItem>
                </TextField>
              </Box>

              {/* Sprint */}
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Sprint</Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  placeholder="Seleccione sprint"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Seleccione sprint</em>
                  </MenuItem>
                  {sprintOptions.map(s => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* User */}
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>Usuario</Typography>
                <TextField
                  select
                  size="small"
                  fullWidth
                  placeholder="Seleccione usuario"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Seleccione usuario</em>
                  </MenuItem>
                  {userOptions.map(u => (
                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Button sx={{ mt: 2 }} variant="contained">Guardar</Button>
            </Box>
          </CardContent>
        </Card>

        {/** Stories list */}
        <Card sx={{ width: '60%', p: 2, borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Historias</Typography>
              <Button variant='contained'>+ Ocultar formulario</Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'justify' }}>
              {stories.length === 0 ? (
                <>
                  <Typography color="text.secondary">No hay historias disponibles.</Typography>
                  {__DEV_DEBUG && (
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #ddd', borderRadius: 2, fontSize: 12 }}>
                      <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Debug</Typography>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                        {JSON.stringify({
                          receivedKeys: debugInfo.payload && Object.keys(debugInfo.payload),
                          isArrayPayload: Array.isArray(debugInfo.payload),
                          hasStoriesKey: !!debugInfo.payload?.stories,
                          usersLen: (debugInfo.payload?.users || []).length,
                          sprintsLen: (debugInfo.payload?.sprints || []).length,
                        }, null, 2)}
                      </pre>
                      <Typography sx={{ mt: 1 }}>
                        Tip: asegúrate de que <code>getStories()</code> devuelva el body (no el objeto de Axios completo).  
                        Si usas Axios, haz <code>return (await axios.get(...)).data</code>.
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                stories.map((story) => {
                  const statusColor = getStatusColor(story.status);
                  return (
                    <Card
                      key={story.id}
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <CardContent sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                          <Typography>{story.sprint?.name || 'Sin asignar'}</Typography>
                          <Chip
                            label={story.status || 'Sin estado'}
                            size="small"
                            sx={{
                              bgcolor: statusColor.bg,
                              color: statusColor.color,
                              fontWeight: 'bold',
                              mb: 1
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '13px', mb: 1 }}>{story.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          <span>{Number.isFinite(story.points) ? story.points : 0}</span> pts • <span>{story.user?.name || 'Sin asignar'}</span>
                        </Typography>
                      </CardContent>

                      <Box>
                        <IconButton color="default" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton color="default" size="small" onClick={() => handleDelete(story.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  )
                })
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Stories;
