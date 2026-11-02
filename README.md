# Administrador de servicios

Proyecto Node.js con ESM y Express que expone una API REST para administrar los servicios de un sistema de turnos y reservas. La lógica de datos está en la clase `ServiceManager` y los datos se guardan en un archivo JSON.

## Estructura

```
src/
├── config/
│   └── env.config.js
├── managers/
│   └── ServiceManager.js
├── middlewares/
│   ├── routingDetector.middleware.js
│   └── validateService.middleware.js
├── routes/
│   └── services.router.js
├── data/
│   └── services.json
├── app.js
└── server.js
```

- `app.js`: levanta el servidor en el puerto definido en `.env`.
- `server.js`: crea la app de Express, registra los middlewares y monta el router en `/api/services`.
- `services.router.js`: define los endpoints del recurso `services`.

## Instalación

```
git clone https://github.com/EMAGMZ/proyecto-backend-1.git
cd proyecto-backend-1
npm install
```

Crear un archivo `.env` en la raíz a partir de `.env.example`.

## Ejecución

```
npm start
```

Modo desarrollo (se reinicia al guardar cambios):

```
npm run dev
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor. Obligatoria: si falta o no es un número, la app no inicia. | `8080` |
| `NODE_ENV` | Entorno de ejecución. Si no se define, toma `development`. | `development` |

## Recurso `services`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | Se genera automáticamente. No se recibe desde afuera. |
| `name` | string | Nombre del servicio |
| `description` | string | Descripción |
| `duration` | number | Duración en minutos |
| `price` | number | Precio |
| `category` | string | Categoría |
| `available` | boolean | Si está disponible |

## Endpoints

Base: `http://localhost:8080/api/services`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/services` | Lista todos los servicios. Acepta filtros `?category=` y `?available=` | 200 |
| GET | `/api/services/:sid` | Devuelve un servicio por id | 200, 404 |
| POST | `/api/services` | Crea un servicio. El `id` se genera automáticamente | 201, 400 |
| PUT | `/api/services/:sid` | Actualiza un servicio. No permite modificar el `id` | 200, 400, 404 |
| DELETE | `/api/services/:sid` | Elimina un servicio | 200, 404 |

### Ejemplos

Filtrar por categoría y disponibilidad:

```
GET /api/services?category=spa&available=true
```

Crear un servicio (body JSON):

```json
{
  "name": "Consulta médica general",
  "description": "Consulta clínica de rutina",
  "duration": 30,
  "price": 12000,
  "category": "Salud",
  "available": true
}
```

Respuesta exitosa:

```json
{ "status": "success", "payload": { "...": "...", "id": 7 } }
```

Respuesta de error (faltan campos):

```json
{ "status": "error", "message": "Faltan campos obligatorios", "missingFields": ["price"] }
```

## Uso de `ServiceManager`

```js
import ServiceManager from "./managers/ServiceManager.js";

const manager = new ServiceManager(databasePath);
```

### getServices()

Devuelve todos los servicios.

```js
const services = await manager.getServices();
```

### getServiceById(id)

Devuelve el servicio o `null` si no existe.

```js
const service = await manager.getServiceById(4);
```

### addService(serviceData)

Valida que estén todos los campos obligatorios y genera el `id`. Si falta un campo, lanza un error.

```js
const result = await manager.addService({
  name: "Corte de cabello",
  description: "Corte con lavado",
  duration: 40,
  price: 25000,
  category: "Peluquería",
  available: true,
});
// { payload: { ...servicio, id: 7 }, status: "Ok" }
```

### updateService(id, updatedData)

Actualiza los campos enviados. El `id` no se puede modificar.

```js
const result = await manager.updateService(4, { price: 16000 });
// { payload: { ...servicioActualizado }, status: "Ok" }
// Si no existe: { payload: null, status: "NotOk" }
```

### deleteService(id)

Elimina el servicio.

```js
const result = await manager.deleteService(6);
// { payload: 6, status: "Ok" }
// Si no existe: { payload: 6, status: "NotOk", message: "notFoundedService" }
```
