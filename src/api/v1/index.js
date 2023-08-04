import express from "express";
import { authRoute } from "./auth/auth.route.js";
import { categoryRoute } from "./categories/categories.route.js";
import { productsRoute } from "./products/products.route.js";
import { usdRoute } from "./usd/usd.route.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/categories", categoryRoute);
router.use("/products", productsRoute);
router.use("/usd", usdRoute);

export default router;
