import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { TopupFilter, TopupSchema } from "./topup.schema.js";
import { getTopups, topup, totalReport } from "./topup.controller.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
const router = express.Router();

router.post(
  "/",
  jwtAuthMiddleware,
  validateRequestMiddleware({ body: TopupSchema }),
  topup
);
router.get(
  "/",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TopupFilter }),
  getTopups
);
router.get("/report-total", jwtAuthMiddleware, roleMiddleware(1), totalReport);

export { router as toupRouter };
