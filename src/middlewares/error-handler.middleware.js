import { BaseErrorException } from "../exceptions/base-error.exception.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  if (err instanceof BaseErrorException) {
    console.log(
      "🚀 ~ file: error-handler.middleware.js:4 ~ errorHandlerMiddleware ~ err:",
      err
    );
    return res.status(err.statusCode).send({ error: err?.serializeError() });
  }
  res.status(500).send({ error: { message: "Internal server error." } });
};
