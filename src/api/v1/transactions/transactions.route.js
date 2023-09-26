import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import {
  adminApproveWithdraw,
  adminGetAllWithdraw,
  adminRejectWithdraw,
  getTransctions,
  userGetAllRequestWithdraw,
  userRequestToWithdraw,
} from "./transactions.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
// import { topup, totalReport } from "./topup.controller.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
import {
  TransactionsFilter,
  WithdrawIdSchema,
  WithdrawSchema,
} from "./transactions.schema.js";
const router = express.Router();

router.get(
  "/",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  getTransctions
);
router.get(
  "/withdraw",
  jwtAuthMiddleware,
  validateRequestMiddleware({ query: TransactionsFilter }),
  userGetAllRequestWithdraw
);
router.post(
  "/withdraw",
  jwtAuthMiddleware,
  validateRequestMiddleware({ body: WithdrawSchema }),
  userRequestToWithdraw
);

router.get(
  "/withdraw/admin",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  adminGetAllWithdraw
);
router.post(
  "/withdraw/:withdrawId/approve",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ params: WithdrawIdSchema }),
  adminApproveWithdraw
);
router.post(
  "/withdraw/:withdrawId/reject",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ params: WithdrawIdSchema }),
  adminRejectWithdraw
);

export { router as transactoinsRouter };
