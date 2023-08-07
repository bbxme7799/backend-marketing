import express from "express";
import { googleAuth, signin, signout, singup } from "./auth.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import { SigninSchema, SignupSchema } from "./auth.schema.js";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:8000/",
  }),
  googleAuth
);
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
