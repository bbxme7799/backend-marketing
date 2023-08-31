import express from "express";
import {
  getNonce,
  googleAuth,
  metamaskAuth,
  signin,
  signout,
  signup,
  verifyEmail,
} from "./auth.controller.js";
import { validateRequestMiddleware } from "../../../middlewares/validate-request.middleware.js";
import {
  SigninMetamaskSchema,
  SigninSchema,
  SignupSchema,
} from "./auth.schema.js";
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
router.get("/nonce", getNonce);
router.post(
  "/metamask",
  validateRequestMiddleware({ body: SigninMetamaskSchema }),
  metamaskAuth
);
router.post(
  "/signin",
  validateRequestMiddleware({ body: SigninSchema }),
  signin
);
router.post(
  "/signup",
  validateRequestMiddleware({ body: SignupSchema }),
  signup
);

router.get("/verify/:email", verifyEmail);

router.post("/signout", signout);

export { router as authRoute };
