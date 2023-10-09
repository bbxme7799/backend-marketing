import express from "express";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
import {
  adminApproveWithdraw,
  adminGetAllDeposit,
  adminGetAllRequestWithdraw,
  adminGetAllTransctions,
  adminGetAllWithdraw,
  adminGetReportTransactions,
  adminRejectWithdraw,
  userGetAllRequestWithdraw,
  userGetAllTransctions,
  userRequestToWithdraw,
} from "./transactions.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import {
  TransactionsFilter,
  WithdrawIdSchema,
  WithdrawSchema,
} from "./transactions.schema.js";
const router = express.Router();

router.get(
  "/report",
  jwtAuthMiddleware,
  roleMiddleware(1),
  adminGetReportTransactions
);
router.get(
  "/admin",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  adminGetAllTransctions
);
router.get(
  "/",
  jwtAuthMiddleware,
  validateRequestMiddleware({ query: TransactionsFilter }),
  userGetAllTransctions
);

router.get(
  "/deposit",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  adminGetAllDeposit
);
router.get(
  "/withdraw",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  adminGetAllWithdraw
);

router.get(
  "/request-withdraw",
  jwtAuthMiddleware,
  validateRequestMiddleware({ query: TransactionsFilter }),
  userGetAllRequestWithdraw
);
router.post(
  "/request-withdraw",
  jwtAuthMiddleware,
  validateRequestMiddleware({ body: WithdrawSchema }),
  userRequestToWithdraw
);

router.get(
  "/request-withdraw/admin",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ query: TransactionsFilter }),
  adminGetAllRequestWithdraw
);
router.post(
  "/request-withdraw/:withdrawId/approve",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ params: WithdrawIdSchema }),
  adminApproveWithdraw
);
router.post(
  "/request-withdraw/:withdrawId/reject",
  jwtAuthMiddleware,
  roleMiddleware(1),
  validateRequestMiddleware({ params: WithdrawIdSchema }),
  adminRejectWithdraw
);

export { router as transactoinsRouter };
