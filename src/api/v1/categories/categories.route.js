import express from "express";

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
const router = express.Router();

router.get(
  "/",
  validateRequestMiddleware({ query: CategoryFilter }),
  getAllCategories
);
router.post(
  "/",
  validateRequestMiddleware({ body: CategoySchema }),
  createCategory
);
router.put(
  "/:catId",
  validateRequestMiddleware({
    body: CategoySchema,
    params: CategoryIdSchema,
  }),
  editCategory
);
router.delete(
  "/:catId",
  validateRequestMiddleware({
    // body: CategoySchema,
    params: CategoryIdSchema,
  }),
  deleteCategory
);

export { router as categoryRoute };
