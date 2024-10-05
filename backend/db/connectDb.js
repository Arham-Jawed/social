import mongoose from "mongoose";
import env from "../constants.js";

export default async function ConnectDB() {
  try {
    const res = await mongoose.connect(env.databaseUrl);
    console.log(`Successfully Connected To DB :: ${res.connection.host}`);
  } catch (e) {
    console.error(`Internal Error While Connecting To DB :: ${e.message}`);
    process.exit(1);
  }
}
