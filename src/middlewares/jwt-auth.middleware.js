import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { NotAuthorizeRequestException } from "../exceptions/not-authorize-request.exception.js";
export const jwtAuthMiddleware = (req, res, next) => {
  if (!req.session?.jwt) {
    throw new NotAuthorizeRequestException();
  }
  try {
    const payload = jwt.verify(req.session.jwt, config.jwtSecretKey);
    req.currentUser = payload;
    next();
  } catch (err) {
    console.log(err);
    throw new NotAuthorizeRequestException();
  }
};

