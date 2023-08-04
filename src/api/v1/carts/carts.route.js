import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import {
  addToCart,
  getCartItems,
  editCartItem,
  removeCartItem,
} from "./carts.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { ProdIdSchema } from "../products/products.schema.js";
import { CartSchema, ItemIdSchema } from "./carts.schema.js";

const router = express.Router();

router.get("/", jwtAuthMiddleware, getCartItems);
router.post(
  "/:prodId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: ProdIdSchema, body: CartSchema }),
  addToCart
);
router.put(
  "/:itemId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: ItemIdSchema, body: CartSchema }),
  editCartItem
);
router.delete(
  "/:itemId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: ItemIdSchema }),
  removeCartItem
);

export { router as cartsRoute };
