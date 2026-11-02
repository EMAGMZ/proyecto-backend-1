import app from "./server.js";
import env from "./config/env.config.js";

app.listen(env.port, () => {
  console.log(`Servidor escuchando en http://localhost:${env.port}`);
});
