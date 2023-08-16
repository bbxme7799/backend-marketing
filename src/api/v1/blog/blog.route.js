import express from "express";
import { getAllPosts, createPost, getPostById } from "./blog.controller.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";

const router = express.Router();

// GET /api/v1/blog - เรียกดูโพสต์ทั้งหมด
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/createpost", jwtAuthMiddleware, createPost);

export { router as blogRoute };
