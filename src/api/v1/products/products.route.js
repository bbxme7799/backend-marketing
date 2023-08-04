import express from "express";
import { getAllProducts } from "./products.controller.js";
import { ProductFilter } from "./products.schema.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
const router = express.Router();

router.get(
  "/",
  validateRequestMiddleware({ query: ProductFilter }),
  getAllProducts
);

export { router as productsRoute };
