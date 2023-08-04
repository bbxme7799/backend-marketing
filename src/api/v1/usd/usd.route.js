import express from "express";
import { getUsd } from "./usd.controller.js";

const router = express.Router();

router.get("/", getUsd);

export { router as usdRoute };
