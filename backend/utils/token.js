import jwt from "jsonwebtoken";
import env from "../constants.js";

export default function generateTokenAndSetCookie(userId, res) {
  const token = jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "2d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: env.node_env !== "development",
  });
}
