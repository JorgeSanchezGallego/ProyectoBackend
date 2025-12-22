# Proyecto 1 - Backend: API REST de Usuarios y Videojuegos 🎮

**Alumno:** Jorge Sánchez  
**Profesor:** Antonio Rosales  
**Curso:** Desarrollo de Aplicaciones Web - Módulo Backend

## 📋 Descripción del Proyecto

Este proyecto consiste en el desarrollo de una API REST completa utilizando **Node.js, Express y MongoDB**. El objetivo principal es aplicar los conocimientos adquiridos sobre servidores, bases de datos no relacionales, autenticación y gestión de archivos en la nube.

La temática elegida es una **plataforma de gestión de videojuegos**, donde los usuarios pueden registrarse, gestionar su perfil y mantener una lista de videojuegos que han jugado (relación de datos).

## 🛠️ Tecnologías Utilizadas

* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** MongoDB Atlas (Mongoose ODM)
* **Autenticación:** JSON Web Tokens (JWT) & Bcrypt
* **Gestión de Archivos:** Cloudinary + Multer
* **Variables de entorno:** Dotenv

## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd <NOMBRE_DE_LA_CARPETA>
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    El archivo `.env` se incluye en la entrega por requerimientos escolares. Asegúrate de que contenga las credenciales correctas de MongoDB y Cloudinary.

4.  **Cargar datos iniciales (Seed):**
    Para poblar la base de datos con videojuegos iniciales, ejecuta:
    ```bash
    npm run seed
    ```

5.  **Arrancar el servidor:**
    ```bash
    npm run dev
    ```

## 🗄️ Modelo de Datos

Se han implementado dos modelos principales con una relación **1:N** (Un usuario tiene muchos juegos jugados).

### 1. Modelo `Game` (Videojuego)
Utilizado para la colección de juegos disponibles.
* **Campos:** `title`, `genre`, `developer`, `year`, `platform`.

### 2. Modelo `User` (Usuario)
Incluye la lógica de negocio compleja.
* **Datos:** `email` (único), `password` (encriptada), `image` (URL Cloudinary).
* **Roles:** `user` (por defecto) y `admin`.
* **Relación:** `playedGames` -> Array de ObjectIds referenciando al modelo `Game`.
    * *Integridad:* Se evita la duplicidad de juegos en el array usando `$addToSet`.

## ⚙️ Funcionalidades Clave y Requisitos Cumplidos

### 🔐 Autenticación y Seguridad
* Registro de usuarios con hasheo de contraseñas (Bcrypt).
* Login con generación de Token (JWT).
* Middleware de autorización (`isAuth`) para proteger rutas.

### 👥 Gestión de Roles
* **User:** Rol por defecto. Puede ver datos y gestionar su propia cuenta.
* **Admin:** Puede ver todos los usuarios y eliminar cualquier cuenta.
* **Lógica de Promoción:** Solo un administrador puede promover a otro usuario a administrador.

### ☁️ Gestión de Imágenes (Cloudinary)
* Subida de imagen obligatoria al registrarse mediante `multer`.
* **Borrado en cascada:** Al eliminar un usuario (ya sea por sí mismo o por un admin), el servidor conecta con Cloudinary y elimina la imagen asociada para no dejar archivos basura en la nube.

### 🗑️ Eliminación de Cuentas
Se implementa una lógica estricta de permisos:
1.  Un usuario puede eliminar **su propia** cuenta.
2.  Un admin puede eliminar **cualquier** cuenta.
3.  Un usuario normal **NO** puede eliminar la cuenta de otro.

## 📡 Endpoints de la API

| Método | Ruta | Descripción | Auth | Rol |
| :--- | :--- | :--- | :--- | :--- |
| **GAMES** |
| `GET` | `/api/v1/games` | Obtener todos los videojuegos | No | - |
| `POST` | `/api/v1/games` | Crear un videojuego | Sí | Admin |
| **USERS** |
| `POST` | `/api/v1/users/register` | Registrar nuevo usuario (con imagen) | No | - |
| `POST` | `/api/v1/users/login` | Login de usuario | No | - |
| `GET` | `/api/v1/users` | Ver todos los usuarios | Sí | Admin |
| `PUT` | `/api/v1/users/add-game` | Añadir juego a la lista de jugados | Sí | Propio |
| `DELETE` | `/api/v1/users/:id` | Eliminar usuario y su imagen | Sí | Propio/Admin |

## 📧 Entrega

Este proyecto se entrega como parte del Máster en Desarrollo Web.
**Repositorio público enviado a:** antonio.rosales@thepower.education