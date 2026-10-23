import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || "development",
};

if (!process.env.PORT || Number.isNaN(config.port)) {
  console.error("Error: falta la variable PORT o no es un número. Revisá tu archivo .env");
  process.exit(1);
}

export default config;
