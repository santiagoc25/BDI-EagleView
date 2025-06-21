
# EagleView 🦅

## 📝 Descripción

**EagleView** es una plataforma completa que permite a los usuarios explorar un vasto catálogo de películas y series. Los usuarios pueden registrarse, iniciar sesión, buscar contenido, filtrarlo por género, calificarlo y añadirlo a su lista de favoritos. El proyecto también incluye un panel de administración para gestionar el contenido y los usuarios de la plataforma.

Este proyecto fue desarrollado como una solución integral que abarca desde el diseño de la base de datos y la creación de la API REST en el backend, hasta el desarrollo de una interfaz de usuario interactiva y atractiva en el frontend.

## ✨ Características Principales

*   **👤 Autenticación de Usuarios:** Sistema seguro de registro e inicio de sesión con roles (usuario y administrador).
*   **🎬 Catálogo de Contenido:** Explora películas y series a través de un grid y carruseles dinámicos.
*   **🔍 Búsqueda y Filtrado:** Filtra el contenido por género, tipo (película/serie), y más.
*   **⭐ Calificaciones y Favoritos:** Permite a los usuarios calificar el contenido y guardarlo en su lista personal de favoritos.
*   **⚙️ Panel de Administración:** Interfaz exclusiva para administradores para crear, editar y eliminar contenido y gestionar usuarios.
*   **🎨 Interfaz Moderna:** Diseño limpio y responsivo construido con React y Vite.




**Puedes probar la aplicación en vivo aquí:** `[https://eagleview-90hp.onrender.com]`

## 🛠️ Tecnologías Utilizadas

El proyecto está dividido en un backend y un frontend, utilizando las siguientes tecnologías:

### Backend (`Backend-EagleView`)
*   **Framework:** Node.js, Express.js
*   **ORM:** Sequelize (para la interacción con la base de datos)
*   **Base de Datos:** PostgreSQL (o cualquier otra base de datos SQL compatible con Sequelize)
*   **Autenticación:** JSON Web Tokens (JWT)
*   **Validación:** Middleware personalizado para validación de datos.

### Frontend (`Frontend-EagleView`)
*   **Librería:** React
*   **Build Tool:** Vite
*   **Estilos:** CSS plano, posiblemente con una arquitectura de CSS-in-JS (`GlobalStyles.css`, `theme.js`)
*   **Routing:** React Router (suposición común)
*   **Peticiones HTTP:** Axios (suposición común)

### Diseño de Base de Datos
*   **Modelado:** Diagrama Entidad-Relación (ERD), Modelo Lógico (LDM) y Modelo Físico (PDM) diseñados con `draw.io`.
*   **Documentación:** Diccionario de datos completo en formato `.xlsx`.

## 📦 Instalación y Puesta en Marcha

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos
*   Node.js (v16 o superior)
*   npm o yarn
*   Una instancia de PostgreSQL en ejecución.

### 1. Clonar el Repositorio
```bash
git clone git@github.com:santiagoc25/BDI-EagleView.git
cd [BDI-EagleView]
```

### 2. Configurar la Base de Datos
1.  Abre tu cliente de PostgreSQL y crea una nueva base de datos.
    ```sql
    CREATE DATABASE eagleview_db;
    ```
2.  Ejecuta los scripts SQL para crear la estructura y poblar los datos iniciales. **El orden es importante.**
    *   **Crear tablas:** Ejecuta el contenido de `sql/ddl/02-create-tables.sql`.
    *   **Insertar datos base:** Ejecuta los scripts de la carpeta `sql/dml/insert/` en orden numérico (de 01 a 13).

### 3. Configurar el Backend
1.  Navega a la carpeta del backend.
    ```bash
    cd Backend-EagleView
    ```
2.  Instala las dependencias.
    ```bash
    npm install
    ```

### 4. Configurar el Frontend
1.  Navega a la carpeta del frontend desde la raíz del proyecto.
    ```bash
    cd Frontend-EagleView
    ```
2.  Instala las dependencias.
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en la raíz de `Frontend-EagleView` para definir la URL de la API.
    ```dotenv
    VITE_API_BASE_URL=https://bdi-eagleview.onrender.com
    ```

## ▶️ Uso

Una vez configurado, puedes iniciar los servidores de desarrollo.

1.  **Iniciar el servidor del Backend:**
    *   En la terminal, dentro de la carpeta `Backend-EagleView`:
    ```bash
    npm run dev
    ```
    El servidor se ejecutará en `https://bdi-eagleview.onrender.com`.

2.  **Iniciar la aplicación del Frontend:**
    *   Abre una **nueva terminal** y, dentro de la carpeta `Frontend-EagleView`:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `https://eagleview-90hp.onrender.com` (puerto por defecto de Vite).

## 📂 Estructura del Repositorio

El proyecto está organizado en una estructura monorepo con carpetas dedicadas para cada parte de la aplicación y la documentación.

```
.
├── docs/                 # Documentación funcional y técnica
├── models/               # Modelos de la base de datos (ERD, LDM, PDM)
├── sql/                  # Scripts para la creación (DDL) y población (DML) de la BD
│   ├── ddl/
│   └── dml/
└── src/                  # Código fuente de la aplicación
    ├── Backend-EagleView/  # API REST con Node.js y Express
    └── Frontend-EagleView/ # Interfaz de usuario con React y Vite
```

## 📄 Documentación Adicional

Toda la documentación conceptual y técnica del proyecto se encuentra en las carpetas `docs/` y `models/`. Esto incluye:
*   **Manual de Usuario:** `docs/Technical/MANUAL DE USUARIO Eagle View.pdf`
*   **Diagrama Entidad-Relación (ERD):** `models/ERD/`
*   **Modelo Lógico de Datos (LDM):** `models/LDM/`
*   **Modelo Físico de Datos (PDM):** `models/PDM/`
*   **Diccionario de Datos:** `models/PDM/diccionario_datos EagleView+.xlsx`


```
