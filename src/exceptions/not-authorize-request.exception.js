export class NotAuthorizeRequestException extends Error {
  statusCode = 401;
  constructor() {
    super("Not authorize.");
  }
  serializeError() {
    return { message: "Not authorize." };
  }
}
