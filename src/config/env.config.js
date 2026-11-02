import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = ["PORT", "NODE_ENV"];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Error: faltan variables de entorno: ${missing.join(", ")}. Revisá tu archivo .env`);
  process.exit(1);
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

if (Number.isNaN(config.port)) {
  console.error("Error: PORT tiene que ser un número. Revisá tu archivo .env");
  process.exit(1);
}

export default config;
