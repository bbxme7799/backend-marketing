import express from "express";
import {
  getAllProducts,
  editProduct,
  deleteProduct,
  createProduct,
} from "./products.controller.js";
import { ProductFilter } from "./products.schema.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
const router = express.Router();

router.get(
  "/",
  validateRequestMiddleware({ query: ProductFilter }),
  getAllProducts
);

// Edit a product
router.put("/:id", editProduct);

// Delete a product
router.delete("/:id", deleteProduct);
router.post("/", createProduct);

export { router as productsRoute };
