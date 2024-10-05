import { Router } from "express";
import {
  GetMe,
  Login,
  Logout,
  Register,
} from "../controllers/auth.controllers.js";
import ProtectRoutes from "../middlewares/auth.middleware.js";

const router = Router();

//Routes:-
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", ProtectRoutes, GetMe);

export default router;
