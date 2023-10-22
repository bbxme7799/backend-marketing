import cron from "node-cron";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const resetProductSchedule = async () => {
  cron.schedule("*/1 * * * *", async () => {
  // cron.schedule("0 0 * * *", async () => {
    try {
      console.log("query product");
      const response = await axios.get(
        "https://iplusview.store/api?key=09d21f71d09164a03081ef2c7642cc0f&action=services"
      );

      for (const newProduct of response.data) {
        // ตรวจสอบว่าข้อมูลมีอยู่ในระบบหรือไม่
        const existingProduct = await prisma.product.findUnique({
          where: { serviceId: newProduct.serviceId },
        });

        if (existingProduct) {
          // ถ้าข้อมูลมีอยู่ในระบบแล้ว ให้อัปเดตข้อมูลเดิม
          await prisma.product.update({
            where: { serviceId: newProduct.serviceId },
            data: newProduct,
          });
        } else {
          // ถ้าข้อมูลไม่มีอยู่ในระบบ ให้สร้างข้อมูลใหม่
          await prisma.product.create({
            data: newProduct,
          });
        }
      }

      const categories = await prisma.product.findMany({
        distinct: "category",
        select: {
          category: true,
        },
      });

      for (const cat of categories) {
        // ตรวจสอบว่าหมวดหมู่มีอยู่ในระบบหรือไม่
        const existingCategory = await prisma.category.findUnique({
          where: { name: cat.category },
        });

        if (!existingCategory) {
          // ถ้าหมวดหมู่ไม่มีอยู่ในระบบ ให้สร้างหมวดหมู่ใหม่
          await prisma.category.create({
            data: { name: cat.category },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
};