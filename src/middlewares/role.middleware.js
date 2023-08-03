import { NotAuthorizeRequestException } from "../exceptions/not-authorize-request.exception.js";
import { ForbiddenRequestException } from "../exceptions/forbidden-request.exception.js";

export const roleMiddleware = (roleNumber = 1) => {
  return (req, res, next) => {
    if (!req.currentUser) throw new NotAuthorizeRequestException();
    if (req.currentUser.role !== roleNumber)
      throw new ForbiddenRequestException();
  };
};
