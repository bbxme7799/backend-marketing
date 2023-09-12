import express from "express";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import {
  getMyOrders,
  getOneMyOrder,
  ordering,
  getAllOrders,
  TotalReport,
} from "./orders.controller.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { OrderIdSchema } from "./orders.shema.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
const router = express.Router();
router.get("/getallorder", jwtAuthMiddleware, roleMiddleware(1), getAllOrders);
router.post("/:userId", jwtAuthMiddleware, ordering);
router.get("/", jwtAuthMiddleware, getMyOrders);
router.get("/total-report", jwtAuthMiddleware, roleMiddleware(1), TotalReport);
router.get(
  "/:orderId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: OrderIdSchema }),
  getOneMyOrder
);

export { router as ordersRoute };
