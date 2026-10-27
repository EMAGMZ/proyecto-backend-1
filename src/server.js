import express from "express";
import path from "node:path";
import ServiceManager from "./managers/ServiceManager.js";
import RoutingDetector from "./middlewares/routingDetector.middleware.js";

const DATABASE_NAME = "services.json";
const databasePath = path.join(import.meta.dirname, "data", DATABASE_NAME);

const manager = new ServiceManager(databasePath);
const app = express();

app.use(express.json());
app.use(RoutingDetector);

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

export default app;