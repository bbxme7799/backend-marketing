import express from "express";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";

import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";

import {
  CategoryFilter,
  CategoryIdSchema,
  CategoySchema,
} from "./categories.schema.js";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
} from "./categories.controller.js";

import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
const router = express.Router();

router.get(
  "/",
  validateRequestMiddleware({ query: CategoryFilter }),
  getAllCategories
);
router.post(
  "/",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ body: CategoySchema }),
  createCategory
);
router.put(
  "/:catId",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({
    body: CategoySchema,
    params: CategoryIdSchema,
  }),
  editCategory
);
router.delete(
  "/:catId",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({
    // body: CategoySchema,
    params: CategoryIdSchema,
  }),
  deleteCategory
);

export { router as categoryRoute };
