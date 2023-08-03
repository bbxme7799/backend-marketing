export class NotFoundRequestException extends Error {
  statusCode = 404;
  constructor() {
    super("Route not found.");
  }
  serializeError() {
    return { message: "Not found." };
  }
}
