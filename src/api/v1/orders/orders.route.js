import express from "express";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import {
  getMyOrders,
  getOneMyOrder,
  ordering,
  getAllOrders,
  TotalReport,
  statisticReport,
  buyNow,
} from "./orders.controller.js";
import { jwtAuthMiddleware } from "../../../middlewares/jwt-auth.middleware.js";
import { BuyNowSchema, OrderIdSchema } from "./orders.shema.js";
import { roleMiddleware } from "../../../middlewares/roleMiddleware.js";
import { ProdIdSchema } from "../products/products.schema.js";
const router = express.Router();
router.get("/getallorder", jwtAuthMiddleware, roleMiddleware(1), getAllOrders);
router.post(
  "/buynow/:prodId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: ProdIdSchema, body: BuyNowSchema }),
  buyNow
);
router.post("/:userId", jwtAuthMiddleware, ordering);
router.get("/", jwtAuthMiddleware, getMyOrders);
router.get("/total-report", jwtAuthMiddleware, roleMiddleware(1), TotalReport);
router.get("/statistic", statisticReport);
router.get(
  "/:orderId",
  jwtAuthMiddleware,
  validateRequestMiddleware({ params: OrderIdSchema }),
  getOneMyOrder
);

export { router as ordersRoute };
