# SprintFlow- Frontend

<div align="center">
  <img src="public/SprintFlow-green.gif" alt="SprintFlow Logo Animado" width="600" style="border-radius: 30px;">
</div>

## Descripción
SprintFlow es una aplicación encargada de la creación y asignación de usuarios, gestión de sprints, visualización y planificación de equipos. 
Se integra con el backend real, usando autenticación JWT y control de roles (admin/developer).

---

## Funcionalidades principales
- Login y registro de usuarios conectados al backend real.
- Gestión de sprints:
  - Creación, edición y eliminación **solo para administradores**.
  - Lectura de sprints accesible a todos los usuarios autenticados.
  - Asignación de miembros del equipo y planificación de historias con puntos Fibonacci válidos.
- Persistencia de sesión en `authStore` (token JWT y datos del usuario).
- Gestión global del estado de sprints con `SprintStore` y Zustand.
- Manejo de errores y estados de carga en tiempo real.

---

## Tecnologías utilizadas
- React
- Zustand
- Axios
- React Router
- CSS / estilos personalizados

---

## Estructura
```
public/
src/
├── assets/
├── components/
│ ├── Footer/
│ ├── Navbar/
│ ├── LoadingOverlay.jsx
│ ├── LoadingOverlay.test.jsx
│ ├── ProtectedRoute.jsx
│ └── SprintFlowLogo.jsx
├── context/
│ ├── AlertContext.jsx
│ └── ThemeContext.jsx
├── hooks/
│ └── UseAlert.jsx
├── layout/
│ └── Layout.jsx
├── pages/
│ ├── AdminProfile.jsx
│ ├── AdminDashboard.jsx
│ ├── Configuration.jsx
│ ├── CreateEditSprint.jsx
│ ├── LoginPage.jsx
│ ├── LoginPage.test.jsx
│ ├── NotFoundPage.jsx
│ ├── NotFoundPage.test.jsx
│ ├── RegisterPage.jsx
│ ├── RegisterPage.test.jsx
│ ├── RegisterPoints.jsx
│ ├── Results.jsx
│ ├── SprintDetail.jsx
│ ├── UserDashboard.jsx
│ └── UserProfile.jsx
├── router/
│ └── Router.jsx
├── services/
│ ├── AuthServices.js
│ ├── SprintService.js
│ ├── UserService.js
│ └── completionService.js
├── store/
│ ├── SprintStore.js
│ ├── authStore.js
│ └── completionStore.js
├── types/
│ └── userTypes.js
└── utils/
├── App.css
├── App.jsx
├── index.css
├── main.jsx
└── setupTests.js

.gitignore
README.md
eslint.config.js
index.html
package-lock.json
package.json
vite.config.js
```
---

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar el frontend en modo desarrollo
npm run dev
```
