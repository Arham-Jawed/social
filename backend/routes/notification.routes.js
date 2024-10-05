import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  getAllNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controllers.js";

const router = Router();

//Routes :-

router.get("/", ProtectRoutes, getAllNotifications);
router.delete("/", ProtectRoutes, deleteNotifications);
router.delete("/:id", ProtectRoutes, deleteNotification);

export default router;
