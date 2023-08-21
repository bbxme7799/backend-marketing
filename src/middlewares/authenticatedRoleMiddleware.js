import { roleMiddleware } from "./roleMiddleware.js";
import { UnauthorizedRequestException } from "../exceptions/unauthorized-request.exception.js";

export const authenticatedRoleMiddleware = (roleNumber) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      throw new UnauthorizedRequestException("User is not authenticated");
    }

    roleMiddleware(roleNumber)(req, res, next);
  };
};
