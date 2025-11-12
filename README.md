# SprintFlow - Cliente (Frontend)

<p align="center"><img src="public/favicon.svg" alt="Logo de SprintFlow" width="100" /></p>

Bienvenido al frontend de **SprintFlow**, una aplicación web diseñada para la gestión ágil de proyectos, facilitando el seguimiento de tareas, sprints y el progreso del equipo.

## 📜 Descripción

Este proyecto contiene toda la interfaz de usuario con la que interactúan los usuarios de SprintFlow. Se comunica con una API backend para obtener y gestionar los datos. Fue desarrollado utilizando **React**.

## ✨ Características Principales

*   **Gestión de Sprints:** Crea, asigna, y actualiza el estado de los Sprints.
*   **Autenticación de Usuarios:** Registro e inicio de sesión seguros con JWT.
*   **Diseño Responsivo:** Experiencia de usuario fluida tanto en escritorio como en dispositivos móviles.

## 🚀 Tecnologías Utilizadas

*   **Framework:** React
*   **Lenguaje:** JavaScript
*   **Gestor de Estado:** Zustand
*   **Estilos y Componentes:** Material-UI (MUI)
*   **Enrutamiento:** React Router
*   **Bundler:** Vite

## ⚙️ Primeros Pasos

Sigue estas instrucciones para tener una copia del proyecto funcionando en tu máquina local para desarrollo y pruebas.

### Prerrequisitos

Necesitarás tener instalado Node.js y npm (o yarn) en tu sistema.

*   Node.js (se recomienda versión LTS)
*   npm o yarn

### Instalación

1.  **Clona el repositorio**
    ```bash
    git clone https://github.com/SprintFlow/SprintFlow-Client.git
    ```

2.  **Navega al directorio del cliente**
    ```bash
    cd SprintFlow-Client
    ```

3.  **Instala las dependencias**
    ```bash
    npm install
    ```

4.  **Inicia el servidor de desarrollo**
    ```bash
    npm run dev
    ```

¡Abre http://localhost:5173 (o el puerto que indique Vite) en tu navegador para ver la aplicación!

## 🔐 Autenticación de Usuarios

El sistema de autenticación es el punto de entrada a **SprintFlow**. Permite a los usuarios registrarse para crear una cuenta nueva y acceder a la plataforma de forma segura.

### Registro de Nuevos Usuarios
*   **Ruta:** `/register`
*   **Componente Principal:** `src/pages/RegisterPage.jsx`
*   **Flujo:** El usuario completa un formulario con su nombre, email, contraseña y **selecciona una pregunta de seguridad con su respuesta**. Esta pregunta será clave para la recuperación de la cuenta. Tras una validación exitosa, se crea la cuenta y se le redirige a la página de inicio de sesión.

### Inicio de Sesión
*   **Ruta:** `/` (o `/login`)
*   **Componente Principal:** `src/pages/LoginPage.jsx`
*   **Flujo:** El usuario introduce su email y contraseña. Si las credenciales son correctas, la API devuelve un **JSON Web Token (JWT)** que se almacena en el cliente para mantener la sesión. El usuario es redirigido a su dashboard correspondiente (`/user-dashboard` o `/admin-dashboard`).

### Recuperación de Contraseña
*   **Ruta:** `/forgot-password`
*   **Componente Principal:** `src/pages/ForgotPasswordPage.jsx`
*   **Flujo:** Si un usuario olvida su contraseña, puede iniciar un proceso de recuperación en varios pasos:
    1.  **Verificación de Email:** El usuario introduce su correo para buscar la cuenta.
    2.  **Pregunta de Seguridad:** El sistema le muestra la pregunta de seguridad que configuró en el registro.
    3.  **Nueva Contraseña:** Si la respuesta a la pregunta es correcta, se le permite establecer una nueva contraseña.
