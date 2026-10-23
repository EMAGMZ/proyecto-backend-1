# Administrador de servicios

Proyecto Node.js con ESM que implementa la clase `ServiceManager` para administrar los servicios de un sistema de turnos y reservas. Los datos se guardan en un archivo JSON.

## Estructura

```
src/
├── config/
│   └── env.config.js
├── managers/
│   └── ServiceManager.js
├── data/
│   └── services.json
└── app.js
```

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
