import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { TopupSchema } from "./topup.schema.js";
import { topup } from "./topup.controller.js";
const router = express.Router();

router.post(
  "/",
  jwtAuthMiddleware,
  validateRequestMiddleware({ body: TopupSchema }),
  topup
);

export { router as toupRouter };
