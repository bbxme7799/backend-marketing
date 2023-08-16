import express from "express";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { getMyOrders, getOneMyOrder, ordering } from "./orders.controller.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { OrderIdSchema } from "./orders.shema.js";
const router = express.Router();

router.post("/:userId", jwtAuthMiddleware, ordering);
router.get("/", jwtAuthMiddleware, getMyOrders);
router.get(
  "/:orderId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: OrderIdSchema }),
  getOneMyOrder
);

export { router as ordersRoute };
