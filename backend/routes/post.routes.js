import { Router } from "express";
import ProtectRoutes from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPost,
  getFollowingPost,
  getUserPosts,
  getPostById,
} from "../controllers/post.controllers.js";

const router = Router();

//Routes:-

router.get("/all", ProtectRoutes, getAllPosts);
router.get("/user/:username", ProtectRoutes, getUserPosts);
router.get("/following", ProtectRoutes, getFollowingPost);
router.get("/liked/:id", ProtectRoutes, getLikedPost);
router.post("/create", ProtectRoutes, createPost);
router.post("/like/:id", ProtectRoutes, likeUnlikePost);
router.post("/comment/:id", ProtectRoutes, commentOnPost);
router.delete("/:id", ProtectRoutes, deletePost);
router.get("/:id", ProtectRoutes, getPostById);

export default router;
