import { Router } from "express";
import path from "node:path";
import BookingManager from "../managers/BookingManager.js";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();

const bookingManager = new BookingManager(
    path.join(import.meta.dirname, "..", "data", "bookings.json")
);

const serviceManager = new ServiceManager(
    path.join(import.meta.dirname, "..", "data", "services.json")
);

router.post("/", async (req, res) => {
    try {
        const result = await bookingManager.createBooking(req.body);
        res.status(201).json({ status: "success", payload: result.payload });
    } catch (error) {
        res.status(400).json({ status: "error", message: error.message });
    }
});

export default router;