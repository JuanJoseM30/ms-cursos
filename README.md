# ms-cursos · Contrato de la API

## Descripción
* **Entidad que gestiona:** Cursos (Evaluación del Módulo 3, microservicio n.º 1).
* **Pareja:** Santiago Garzón Gómez · Juan José Marín Orejuela.
* **Puerto en el que escucha:** 3011, en `127.0.0.1`.
* **Base de datos:** `cursos_db` (MySQL 8).
* **Arquitectura en capas:** routes → controller → service → repository, con el modelo (`models/curso.js`) y `HttpError` (`utils/http-error.js`).

## Cómo ejecutarlo

1. Crear la base de datos y su usuario (en MySQL, como root):

```sql
CREATE DATABASE cursos_db CHARACTER SET utf8mb4;
CREATE USER 'cursos_user'@'localhost' IDENTIFIED BY '<CLAVE>';
GRANT ALL PRIVILEGES ON cursos_db.* TO 'cursos_user'@'localhost';
USE cursos_db;
SOURCE ruta/completa/ms-cursos/db/schema.sql;
```

2. Instalar dependencias y configurar:

```
npm install
cp .env.example .env
```

En el `.env` ajustar `DB_PASSWORD` y poner la **misma** `JWT_SECRET` que tiene ms-usuarios.

3. Arrancar (ms-usuarios debe estar corriendo en el 3001 para obtener el token):

```
npm start
```

Cada petición queda registrada en la terminal con su método, ruta y código de respuesta:

```
10:15:02 GET /cursos?semestre=2026-2 → 200
```

## Representación

```json
{ "id": 1, "codigo": "RSM-101", "nombre": "Redes y Servicios Multimedia", "creditos": 3, "cupo": 30, "semestre": "2026-2" }
```

## Atributos

| Atributo | Tipo | Reglas y obligatoriedad |
|---|---|---|
| id | entero | No: lo asigna la base de datos |
| codigo | texto | Sí (no vacío). **Único → 409** |
| nombre | texto | Sí (no vacío) |
| creditos | entero | Sí, entre 1 y 6 |
| cupo | entero | Sí, mayor que 0 |
| semestre | texto | Sí, formato `AAAA-1` o `AAAA-2` |

## Endpoints

| Operación | Método + URI | Respuesta y errores |
|---|---|---|
| Listar | GET `/cursos` | 200 arreglo |
| Filtrar por semestre | GET `/cursos?semestre=2026-2` | 200 arreglo |
| Consultar por lotes | GET `/cursos?ids=1,3` | 200 arreglo · 400 |
| Obtener | GET `/cursos/:id` | 200 objeto · 400 · 404 |
| Crear | POST `/cursos` | 201 objeto + Location · 400 · 409 |
| Actualizar | PUT `/cursos/:id` | 200 objeto · 400 · 404 · 409 |
| Eliminar | DELETE `/cursos/:id` | 204 · 400 · 404 |

Todos los endpoints pueden responder además **401** y **403** (ver Seguridad).

## Ejemplo para crear

```json
{ "codigo": "SIS-301", "nombre": "Sistemas Operativos", "creditos": 4, "cupo": 20, "semestre": "2027-1" }
```

## Errores

Todos los errores responden un JSON con `error` y, en los 400 de validación, `detalles`:

```json
{ "error": "Datos inválidos", "detalles": ["creditos es obligatorio y debe ser un entero entre 1 y 6"] }
```

## Seguridad

Todas las rutas de `/cursos` exigen la cabecera `Authorization: Bearer <token>`.
El token se obtiene con el login de ms-usuarios (`POST http://127.0.0.1:3001/usuarios/login`)
y ms-cursos lo verifica con la `JWT_SECRET` del `.env` (`middlewares/auth.js`), sin preguntarle a ms-usuarios.

| Operación | Roles permitidos |
|---|---|
| GET (listar, filtrar, obtener) | Cualquier rol autenticado |
| POST, PUT, DELETE | Solo `administrador` (los demás → 403) |

| Código | Cuándo |
|---|---|
| 401 | Falta el token, es inválido o venció |
| 403 | El rol del token no tiene permiso |

## Pruebas

La colección de Postman está en `docs/ms-cursos.postman_collection.json`.
Antes de correrla: hacer el login (caso 0) y pegar el token en la variable `token_admin` de la colección.
