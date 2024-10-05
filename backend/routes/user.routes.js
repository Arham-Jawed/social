import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUser,
} from "../controllers/user.controllers.js";

const router = Router();

router.get("/profile/:username", ProtectRoutes, getUserProfile);
router.get("/suggested", ProtectRoutes, getSuggestedUsers);
router.post("/follow/:id", ProtectRoutes, followUnfollowUser);
router.post("/update", ProtectRoutes, updateUser);

export default router;
