import app from "./src/server.js";
import env from "./src/config/env.config.js";

app.listen(env.port, () => {
  console.log(`Servidor escuchando en http://localhost:${env.port}`);
});
