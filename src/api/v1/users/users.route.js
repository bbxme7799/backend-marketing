import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { me } from "./users.controller.js";

const router = express.Router();

router.get("/", jwtAuthMiddleware, me);

export { router as usersRoute };
