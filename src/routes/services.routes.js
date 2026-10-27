import { Router } from "express";
import path from "node:path";
import ServiceManager from "../managers/ServiceManager.js";
import { validateService } from "../middlewares/validateService.middleware.js";

const router = Router();

const databasePath = path.join(
  import.meta.dirname,
  "..",
  "data",
  "services.json",
);
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

router.get("/:sid", async (req, res) => {
  try {
    const { sid } = req.params;
    const service = await manager.getServiceById(sid);

    if (!service) {
      return res.status(404).json({
        status: "error",
        message: "Servicio no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: service,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener el servicio",
    });
  }
});

router.post("/", validateService, async (req, res) => {
  try {
    const result = await manager.addService(req.body);

    res.status(201).json({
      status: "success",
      payload: result.payload,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear el servicio",
    });
  }
});

export default router;
