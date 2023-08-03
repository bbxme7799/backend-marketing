import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import config from "./config/index.js";
import morgan from "morgan";
import api from "./api/v1/index.js";
import { NotFoundRequestException } from "./exceptions/not-found-request.exception.js";
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware.js";
import { resetProductSchedule } from "./schedules/product.schedule.js";
import { resetUSDSchedule } from "./schedules/usd.schedule.js";

const app = express();
// resetProductSchedule();
// resetUSDSchedule();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use("/api", api);
app.all("*", async (req, res, next) => {
  try {
    throw new NotFoundRequestException();
  } catch (error) {
    next(error);
  }
});

app.use(errorHandlerMiddleware);

app.listen(config.port, () => {
  console.log(process.env.NODE_ENV);
  console.log(`listening on port ${config.port}`);
  // console.log("For the UI, open http://localhost:8000/admin/queues");
});
