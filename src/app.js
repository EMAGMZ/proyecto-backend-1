// import fs from "node:fs/promises"

// console.log('1. Inicio del script');

// setTimeout(() => {
//   console.log('2. setTimeout (0ms)');
// }, 0);

// setImmediate(() => {
//   console.log('3. setImmediate');
// });

// Promise.resolve().then(() => {
//   console.log('4. Promesa resuelta (Microtask)');
// });

// process.nextTick(() => {
//   console.log('5. process.nextTick');
// });

// fs.readFile(import.meta.filename, () => {
//   console.log('6. Lectura de archivo completada (I/O Callback)');
// });

// console.log('7. Fin del script');

import express from "express";
import path from "node:path";
import ServiceManager from "./managers/ServiceManager.js";

const DATABASE_NAME = "services.json";
const databasePath = path.join(import.meta.dirname, "data", DATABASE_NAME);

const manager = new ServiceManager(databasePath);
const app = express();

app.use(express.json());

app.get("/api/services", async (req, res) => {
  try {
    const services = await manager.getServices();
    res.status(200).json({
      status: "success",
      payload: services,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener los servicios",
    });
  }
});

export { app };