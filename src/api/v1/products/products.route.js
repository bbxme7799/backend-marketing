import express from "express";
import {
  getAllProducts,
  editProduct,
  deleteProduct,
  createProduct,
} from "./products.controller.js";
import { ProductFilter } from "./products.schema.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  validateRequestMiddleware({ query: ProductFilter }),
  getAllProducts
);

// Edit a product
router.put("/:id", jwtAuthMiddleware, roleMiddleware(1), editProduct);

// Delete a product
router.delete("/:id", jwtAuthMiddleware, roleMiddleware(1), deleteProduct);
router.post("/", jwtAuthMiddleware, roleMiddleware(1), createProduct);

export { router as productsRoute };
