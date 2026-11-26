import { Router } from "express";
import path from "node:path";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();

const bookingManager = new BookingManager(
  path.join(import.meta.dirname, "..", "data", "bookings.json"),
);

const serviceManager = new ServiceManager(
  path.join(import.meta.dirname, "..", "data", "services.json"),
);

router.post("/", async (req, res) => {
  try {
    const result = await bookingManager.createBooking(req.body);
    res.status(201).json({ status: "success", payload: result.payload });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/:bid", async (req, res) => {
  try {
    const { bid } = req.params;
    const booking = await bookingManager.getBookingById(bid);

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Reserva no encontrada",
      });
    }

    res.status(200).json({
      status: "success",
      payload: booking,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener la reserva",
    });
  }
});

router.post("/:bid/services/:sid", async (req, res) => {
    try {
        const { bid, sid } = req.params;

        const service = await serviceManager.getServiceById(sid);
        if (!service) {
        return res.status(404).json({
        status: "error",
        message: "Servicio no encontrado",
    });
}
    
        const result = await bookingManager.addServiceToBooking(bid, sid);
    if (result.status === "NotOk") {
        return res.status(404).json({
    status: "error",
    message: "Reserva no encontrada",
        });
    }
    res.status(200).json({
        status: "success",
        payload: result.payload,
    })
}catch (error) {
    res.status(500).json({
        status: "error",
        message: "Error al agregar el servicio a la reserva",
    });
}
});


export default router;
