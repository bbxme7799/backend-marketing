export class ForbiddenRequestException extends Error {
  statusCode = 403;
  constructor() {
    super("Forbidden resource.");
  }
  serializeError() {
    return { message: "Forbidden rsource." };
  }
}
