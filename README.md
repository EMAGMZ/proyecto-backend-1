# Sistema de Turnos y Reservas

Proyecto Node.js con ESM y Express que expone una API REST para administrar los servicios y las reservas de un sistema de turnos. La lógica de datos está en las clases `ServiceManager` y `BookingManager`, y los datos se guardan en archivos JSON.

## Estructura

```
src/
├── config/
│   ├── env.config.js
│   └── service.config.js
├── managers/
│   ├── BookingManager.js
│   └── ServiceManager.js
├── middlewares/
│   ├── routingDetector.middleware.js
│   └── validateService.middleware.js
├── routes/
│   ├── bookings.router.js
│   └── services.router.js
├── data/
│   ├── bookings.json
│   └── services.json
├── app.js
└── server.js
```

- `app.js`: levanta el servidor en el puerto definido en `.env`.
- `server.js`: crea la app de Express, registra los middlewares y monta los routers en `/api/services` y `/api/bookings`.
- `service.config.js`: define los campos obligatorios de un servicio (`REQUIRED_FIELDS`).
- `services.router.js`: define los endpoints del recurso `services`.
- `bookings.router.js`: define los endpoints del recurso `bookings`.

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

## Recurso `bookings`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | number | Se genera automáticamente. No se recibe desde afuera. |
| `clientName` | string | Nombre del cliente |
| `clientEmail` | string | Email del cliente |
| `date` | string | Fecha de la reserva (ej. `2026-12-01`) |
| `time` | string | Hora de la reserva (ej. `10:00`) |
| `status` | string | Estado de la reserva (ej. `pending`) |
| `services` | array | Servicios de la reserva. Se genera automáticamente. |

`services` es un array de objetos `{ service, quantity }`, donde `service` es el `id` del servicio y `quantity` la cantidad. Al crear la reserva arranca vacío (`[]`). Si se agrega un servicio que ya está en la reserva, no se agrega un segundo elemento: se incrementa su `quantity`.

## Endpoints

Base: `http://localhost:8080`

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/services` | Lista todos los servicios. Acepta filtros `?category=` y `?available=` | 200, 400 (si `available` no es `true` o `false`) |
| GET | `/api/services/:sid` | Devuelve un servicio por id | 200, 404 |
| POST | `/api/services` | Crea un servicio. El `id` se genera automáticamente | 201, 400 (faltan campos o tipo de dato inválido) |
| PUT | `/api/services/:sid` | Actualiza solo los campos enviados en el body (actualización parcial). No permite modificar el `id` | 200, 400 (tipo de dato inválido), 404 |
| DELETE | `/api/services/:sid` | Elimina un servicio | 200, 404 |
| POST | `/api/bookings` | Crea una reserva. El `id` se genera automáticamente y `services` arranca vacío | 201, 400 (falta un campo o no es texto) |
| GET | `/api/bookings/:bid` | Devuelve una reserva por id | 200, 404 |
| POST | `/api/bookings/:bid/services/:sid` | Agrega un servicio a la reserva. Si ya estaba, incrementa su `quantity` | 200, 404 (no existe la reserva o el servicio) |

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

Respuesta de error (tipo de dato inválido):

```json
{ "status": "error", "message": "Hay campos con un tipo de dato inválido", "invalidFields": ["price", "available"] }
```

Crear una reserva (body JSON):

```json
{
  "clientName": "Ana",
  "clientEmail": "ana@mail.com",
  "date": "2026-12-01",
  "time": "10:00",
  "status": "pending"
}
```

Respuesta de error (falta un campo):

```json
{ "status": "error", "message": "El campo clientEmail esta faltante" }
```

Respuesta después de agregar el servicio `2` dos veces (`POST /api/bookings/1/services/2`):

```json
{
  "status": "success",
  "payload": {
    "clientName": "Ana",
    "clientEmail": "ana@mail.com",
    "date": "2026-12-01",
    "time": "10:00",
    "status": "pending",
    "id": 1,
    "services": [{ "service": 2, "quantity": 2 }]
  }
}
```

## Validaciones

- **services**: `name`, `description` y `category` deben ser texto; `duration` y `price`, números; `available`, booleano. Si algún campo tiene otro tipo, responde 400 con la lista `invalidFields`.
- **bookings**: los 5 campos (`clientName`, `clientEmail`, `date`, `time`, `status`) deben ser texto. Si no, responde 400 indicando el campo que falla.
- En ambos recursos se descartan los campos que no forman parte del recurso, y el `id` nunca se toma del body.

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

## Uso de `BookingManager`

```js
import BookingManager from "./managers/BookingManager.js";

const manager = new BookingManager(databasePath);
```

### createBooking(bookingData)

Valida que estén todos los campos obligatorios (`clientName`, `clientEmail`, `date`, `time`, `status`), valida que todos sean texto, descarta los campos extra que no forman parte de la reserva, genera el `id` e inicializa `services` como array vacío. Si falta un campo o no es texto, lanza un error.

```js
const result = await manager.createBooking({
  clientName: "Ana",
  clientEmail: "ana@mail.com",
  date: "2026-12-01",
  time: "10:00",
  status: "pending",
});
// { payload: { ...reserva, id: 1, services: [] }, status: "Ok" }
// Si falta un campo: lanza Error("El campo clientEmail esta faltante")
// Si un campo no es texto: lanza Error("El campo date debe ser texto")
```

### getBookingById(id)

Devuelve la reserva o `null` si no existe.

```js
const booking = await manager.getBookingById(1);
```

### addServiceToBooking(idBooking, idService)

Agrega el servicio a la reserva con `quantity: 1`. Si el servicio ya estaba, incrementa su `quantity`. No verifica que el servicio exista: eso lo hace el router antes de llamarlo.

```js
const result = await manager.addServiceToBooking(1, 2);
// { payload: { ...reserva, services: [{ service: 2, quantity: 1 }] }, status: "Ok" }
// Si la reserva no existe: { payload: null, status: "NotOk", message: "Booking not found" }
```
