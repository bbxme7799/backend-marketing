import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { me } from "./users.controller.js";
import {
  updateUsername,
  getUsers,
  banOrUnbanUser,
} from "./users.controller.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

// ตั้งชื่อเส้นทางเพื่อแบนผู้ใช้
router.put("/banuser", jwtAuthMiddleware, roleMiddleware(1), banOrUnbanUser);
// ตั้งชื่อเส้นทางเพื่อปลดแบนผู้ใช้
router.put("/unbanuser", jwtAuthMiddleware, roleMiddleware(1), banOrUnbanUser);
router.get("/me", jwtAuthMiddleware, me);
router.get("/getusers", jwtAuthMiddleware, roleMiddleware(1), getUsers);
router.put("/update-username", jwtAuthMiddleware, updateUsername);

export { router as usersRoute };
