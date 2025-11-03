# SprintFlow - Cliente (Frontend)

![Logo de SprintFlow](public/favicon.svg)

Bienvenido al frontend de **SprintFlow**, una aplicación web diseñada para la gestión ágil de proyectos, facilitando el seguimiento de tareas, sprints y el progreso del equipo.

## 📜 Descripción

Este proyecto contiene toda la interfaz de usuario con la que interactúan los usuarios de SprintFlow. Se comunica con una API backend para obtener y gestionar los datos. Fue desarrollado utilizando **React**.

## ✨ Características Principales

*   **Gestión de Proyectos:** Crea y organiza tus proyectos.
*   **Tableros Kanban:** Visualiza tus tareas en tableros con columnas personalizables.
*   **Gestión de Tareas:** Crea, asigna, y actualiza el estado de las tareas.
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
*   **Flujo:** El usuario completa un formulario con su nombre, email y contraseña. Tras una validación exitosa, se crea la cuenta y se le redirige a la página de inicio de sesión.

### Inicio de Sesión
*   **Ruta:** `/` (o `/login`)
*   **Componente Principal:** `src/pages/LoginPage.jsx`
*   **Flujo:** El usuario introduce su email y contraseña. Si las credenciales son correctas, la API devuelve un **JSON Web Token (JWT)** que se almacena en el cliente para mantener la sesión. El usuario es redirigido a su dashboard correspondiente (`/user-dashboard` o `/admin-dashboard`).
