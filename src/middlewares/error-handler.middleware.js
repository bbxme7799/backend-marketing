export const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)
  if (err instanceof Error) {
    return res.status(err.statusCode).send({ error: err?.serializeError() });
  }
  res.status(500).send({ error: { message: "Internal server error." } });
};
