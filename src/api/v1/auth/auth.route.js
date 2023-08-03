import express from "express";
import { signin, signout, singup } from "./auth.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { SigninSchema, SignupSchema } from "./auth.schema.js";
const router = express.Router();

router.post(
  "/signin",
  validateRequestMiddleware({ body: SigninSchema }),
  signin
);
router.post(
  "/signup",
  validateRequestMiddleware({ body: SignupSchema }),
  singup
);
router.post("/signout", signout);

export { router as authRoute };
