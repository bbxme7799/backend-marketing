import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { getTransctions } from "./transactions.controller.js";
// import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
// import { topup, totalReport } from "./topup.controller.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
import { TransactionsFilter } from "./transactions.schema.js";
const router = express.Router();

router.get(
  "/",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  getTransctions
);

export { router as transactoinsRouter };
