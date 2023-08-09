import cron from "node-cron";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const resetProductSchedule = async () => {
  // cron.schedule("*/1 * * * *", async () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("query product");
      const response = await axios.get(
        "https://iplusview.store/api?key=445ffcff1322193be0a307e4a8918716&action=services"
      );

      const delResult = await prisma.product.deleteMany({});
      console.log(delResult);
      const create = await prisma.product.createMany({
        data: response.data,
      });
      console.log(create);
      const categories = await prisma.product.findMany({
        distinct: "category",
        select: {
          category: true,
        },
      });

      await prisma.category.deleteMany({});
      const newCat = await prisma.category.createMany({
        data: categories.map((cat) => ({
          name: cat.category,
        })),
      });
      console.log(newCat);
    } catch (error) {
      console.log(error);
    }
  });
};
