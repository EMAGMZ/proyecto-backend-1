import { Router } from "express";
import path from "node:path";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();

const databasePath = path.join(import.meta.dirname, "..", "data", "services.json");
const manager = new ServiceManager(databasePath);

router.get("/", async (req, res) => {
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

export default router;