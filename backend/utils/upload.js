import { v2 as cloudinary } from "cloudinary";
import env from "../constants.js";

cloudinary.config({
  cloud_name: env.cloudName,
  api_key: env.cloudApiKey,
  api_secret: env.cloudApiSecret,
});

export default async function UploadOnCloud(file) {
  try {
    const res = await cloudinary.uploader.upload(file);
    return res.secure_url;
  } catch (e) {
    console.error(
      `Internal Error While Uploading Image To Cloud :: ${e.message}`
    );
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
