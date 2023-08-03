import express from "express";
import { authRoute } from "./auth/auth.route.js";
import { categoryRoute } from "./categories/categories.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/categories", categoryRoute);

export default router;