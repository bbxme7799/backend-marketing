import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { me } from "./users.controller.js";
import { updateUsername } from "./users.controller.js";

const router = express.Router();

router.get("/me", jwtAuthMiddleware, me);
router.put("/update-username", jwtAuthMiddleware, updateUsername);

export { router as usersRoute };
