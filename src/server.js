import express from "express";
import servicesRouter from "./routes/services.routes.js";
import RoutingDetector from "./middlewares/routingDetector.middleware.js";

const app = express();

app.use(express.json());
app.use(RoutingDetector);

app.use("/api/services", servicesRouter);

export default app;