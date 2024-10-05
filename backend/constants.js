import dotenv from "dotenv";

dotenv.config();

const env = {
  port: Number(process.env.PORT),
  databaseUrl: String(process.env.MONGO_URI),
  jwtSecret: String(process.env.JWT_SECRET),
  origin: String(process.env.ORIGIN),
  node_env: String(process.env.NODE_ENV),
  cloudName: String(process.env.CLOUD_NAME),
  cloudApiKey: String(process.env.CLOUD_API_KEY),
  cloudApiSecret: String(process.env.CLOUD_API_SECRET),
};

export default env;
