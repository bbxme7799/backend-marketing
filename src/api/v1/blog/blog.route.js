import express from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  editPost,
  deletePost,
} from "./blog.controller.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// GET /api/v1/blog - เรียกดูโพสต์ทั้งหมด
router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/createpost", jwtAuthMiddleware, roleMiddleware(1), createPost);
router.put("/editPost/:postId", jwtAuthMiddleware, roleMiddleware(1), editPost);

// เพิ่มเส้นทาง DELETE สำหรับการลบโพสต์
router.delete(
  "/deletePost/:postId",
  jwtAuthMiddleware,
  roleMiddleware(1),
  deletePost
);

export { router as blogRoute };
