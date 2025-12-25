# 🎮 API REST: Plataforma de Gestión de Videojuegos

![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**Proyecto Backend | Máster en Desarrollo Web**

* **Alumno:** Jorge Sánchez
* **Profesor:** Antonio Rosales
* **Repositorio:** [GitHub Link](https://github.com/JorgeSanchezGallego/ProyectoBackend)

## 📋 Descripción

Este proyecto es una API RESTful completa desarrollada con **Node.js y Express**. Simula el backend de una aplicación social de videojuegos donde los usuarios pueden registrarse, gestionar su perfil y administrar una colección de videojuegos jugados.

El sistema cuenta con autenticación segura, roles de usuario, subida de imágenes a la nube y una base de datos NoSQL robusta.

## 🛠️ Stack Tecnológico

Las tecnologías principales y dependencias utilizadas son:

* **Entorno (Runtime):** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB (con Mongoose ODM)
* **Seguridad:** Bcrypt & JSON Web Tokens (JWT)
* **Gestión de Archivos:** Cloudinary + Multer
* **Utilidades:** Dotenv, Nodemon

## ✅ Cumplimiento de Requisitos

| Requisito | Estado | Implementación |
| :--- | :---: | :--- |
| **2 Modelos Mínimo** | ✅ | Modelos `User` y `Videogame`. |
| **1 Relación Mínimo** | ✅ | Relación 1:N (Un usuario tiene muchos videojuegos). |
| **Roles y Permisos** | ✅ | Roles `admin` y `user` gestionados con Middleware. |
| **Auth Middleware** | ✅ | Autenticación vía Token JWT (`isAuth`, `isAdmin`). |
| **Cloudinary** | ✅ | Subida con `multer` y borrado automático en cascada. |
| **Semillas (Seeds)** | ✅ | Script `allSeeds` para poblar juegos y usuarios. |
| **Evitar Duplicados** | ✅ | Uso de `$addToSet` en arrays y `unique` en emails. |
| **CRUD Completo** | ✅ | Implementado en ambas colecciones. |

## 🚀 Instalación y Scripts

Sigue estos pasos para levantar el proyecto en local:

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configuración de Entorno (.env):**
    Crea un archivo `.env` en la raíz con las siguientes variables:
    ```text
    DB_URL=mongodb+srv://...
    JWT_SECRET=tu_secreto_seguro
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    ```

3.  **🌱 Carga de Datos (Seeding):**
    El proyecto incluye scripts automatizados para limpiar y poblar la base de datos de forma secuencial (primero juegos, luego usuarios).
    ```bash
    npm run allSeeds # Usa script uSseed y vGseed
    ```
    *(Este comando ejecuta `vGseed` y `uSseed` en cadena).*

4.  **Ejecución:**
    ```bash
    npm run dev  # Modo desarrollo con Nodemon
    npm start    # Modo producción
    ```

## 🗄️ Modelos de Datos

### 1. User (Usuario)
* **Roles:** `admin` o `user` (por defecto).
* **Seguridad:** Contraseñas encriptadas mediante `bcrypt` antes de guardar (`pre-save hook`).
* **Relación:** Contiene un array `videogames` con referencias (`ObjectId`) a los juegos.
* **Imágenes:** Campo `img` alojado en la carpeta `Users` de Cloudinary.

### 2. Videogame (Videojuego)
* **Datos:** Título, desarrollador, año, género, plataforma y rating.
* **Validaciones:** Año entre 1980-2030, Rating 0-10.
* **Imágenes:** Campo `img` alojado en la carpeta `Videogames` de Cloudinary.

## ⚙️ Funcionalidades Clave

### 🔐 Seguridad y Auth
* **JWT Middleware:** Middleware `isAuth` para proteger rutas privadas y validar el token Bearer.
* **Admin Middleware:** Middleware `isAdmin` para operaciones críticas (ver listado de usuarios, cambiar roles).

### ☁️ Gestión de Imágenes
* **Subida:** Integración con Cloudinary mediante `multer` en el registro de usuarios y creación de juegos.
* **Limpieza Automática:** Al borrar un videojuego o eliminar un usuario de la base de datos, el sistema detecta la URL de la imagen y **la elimina físicamente de Cloudinary** para no dejar archivos basura en la nube.

### 🎮 Gestión de la Colección
* **Añadir Juegos:** Uso de `$addToSet` para evitar duplicados en la lista del usuario.
* **Borrar Juegos:** Uso de `$pull` para eliminar juegos de la lista personal sin afectar a la colección global.

## 📡 Documentación de Endpoints

### 🕹️ Rutas de Videojuegos (`/api/videogames`)

| Método | Endpoint | Descripción | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Listar todos los juegos | No |
| `GET` | `/:id` | Ver detalle por ID | No |
| `GET` | `/search` | Buscar por título (Query param `?title=`) | No |
| `GET` | `/genre/:genre` | Filtrar por género | No |
| `GET` | `/top-rated` | Top 5 mejor valorados | No |
| `GET` | `/random` | Obtener un juego aleatorio | No |
| `GET` | `/bulk` | Creación masiva (InsertMany) | No |
| `POST` | `/` | Crear videojuego (Multipart form) | No |
| `PUT` | `/:id` | Editar videojuego | No |
| `DELETE` | `/:id` | Eliminar videojuego (y su imagen) | No |

### 👤 Rutas de Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth | Rol |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Registrar usuario (Multipart form) | No | - |
| `POST` | `/login` | Iniciar sesión (Devuelve Token) | No | - |
| `GET` | `/` | Ver todos los usuarios | **Sí** | **Admin** |
| `PATCH` | `/update-role/:id` | Cambiar rol (User/Admin) | **Sí** | **Admin** |
| `POST` | `/add-game` | Añadir juego a "Mis juegos" | **Sí** | Propio |
| `DELETE` | `/delete-game` | Quitar juego de "Mis juegos" | **Sí** | Propio |
| `DELETE` | `/:id` | Eliminar cuenta (y su imagen) | **Sí** | Propio/Admin |

---

## 📧 Contacto y Entrega

Este proyecto ha sido desarrollado como parte del Máster de Desarrollo Web.

* **GitHub:** [Jorge Sanchez Gallego](https://github.com/JorgeSanchezGallego)
* **Licencia:** ISC