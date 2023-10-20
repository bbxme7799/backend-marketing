import cron from "node-cron";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const resetUSDSchedule = async () => {
  // cron.schedule("*/1 * * * *", async () => {
  cron.schedule("0 0 * * *", async () => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=BUSD&tsyms=THB"
    );
    const { THB } = response.data;
    console.log("THB", THB);
    await prisma.uSD_rate.deleteMany({});
    await prisma.uSD_rate.create({ data: { rate: THB } });
  });
};
