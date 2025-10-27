// index.js - Exportaciones centralizadas de todos los servicios
// Permite importar todos los servicios desde un punto central

export { default as SprintServices } from './SprintServices';
export { default as UserServices } from './UserServices';
export { default as StoriesServices } from './StoriesServices';
export { default as TasksServices } from './TasksServices';

// También exportar los servicios individuales para flexibilidad
export { SprintServices } from './SprintServices';
export { UserServices } from './UserServices';
export { StoriesServices } from './StoriesServices';
export { TasksServices } from './TasksServices';

// Ejemplo de uso:
/*
// Importar todos los servicios
import { SprintServices, UserServices, StoriesServices, TasksServices } from '../services';

// O importar servicios específicos
import { SprintServices } from '../services/SprintServices';
import UserServices from '../services/UserServices';

// Usar en componentes
const Dashboard = () => {
  useEffect(() => {
    const loadData = async () => {
      const sprints = await SprintServices.getAll();
      const profile = await UserServices.getProfile();
      const stories = await StoriesServices.getBySprint(sprintId);
    };
    loadData();
  }, []);
};
*/
