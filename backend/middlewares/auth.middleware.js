import jwt from "jsonwebtoken";
import env from "../constants.js";
import User from "../models/user.model.js";

export default async function ProtectRoutes(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorize : No token provided",
      });
    }
    const decoded = jwt.verify(token, env.jwtSecret);
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Unauthorize : Invalid token",
      });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (e) {
    console.error(`Internal Error While Validating A User :: ${e.message}`);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
