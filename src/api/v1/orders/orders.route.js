import express from "express";
// import { getAllProducts } from "./products.controller.js";
// import { ProductFilter } from "./products.schema.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { ordering } from "./orders.controller.js";
import { UserIdSchema } from "../users/users.schema.js";
const router = express.Router();

router.post(
  "/:userId",
  validateRequestMiddleware({ params:UserIdSchema }),
  ordering
);

export { router as ordersRoute };