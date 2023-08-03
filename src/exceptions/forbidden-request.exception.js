export class ForbiddenRequestException extends Error {
  statusCode = 404;
  constructor() {
    super("Forbidden resource.");
  }
  serializeError() {
    return { message: "Forbidden rsource." };
  }
}
