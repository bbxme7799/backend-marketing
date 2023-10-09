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

      // เพิ่มการค้นหาข้อมูลที่มีอยู่ในระบบ
      const existingProducts = await prisma.product.findMany({});

      // สร้าง Map ของข้อมูลที่มีอยู่ในระบบเพื่อให้ง่ายต่อการค้นหา
      const existingProductsMap = new Map(
        existingProducts.map((product) => [product.service, product])
      );

      // กำหนดข้อมูลที่จะถูกสร้างหรืออัปเดต
      const dataToCreateOrUpdate = response.data.map((newProduct) => {
        const existingProduct = existingProductsMap.get(newProduct.serviceId);
        if (existingProduct) {
          // ถ้าข้อมูลมีอยู่ในระบบแล้ว ให้อัปเดตข้อมูลเดิม
          return {
            where: { id: existingProduct.service },
            data: newProduct,
          };
        } else {
          // ถ้าข้อมูลไม่มีอยู่ในระบบ ให้สร้างข้อมูลใหม่
          return {
            data: newProduct,
          };
        }
      });

      // ให้อัปเดตหรือสร้างข้อมูล
      const createOrUpdateResult = await prisma.product.createMany({
        data: dataToCreateOrUpdate,
        skipDuplicates: true, // ข้ามข้อมูลที่มีอยู่ในระบบแล้ว
      });
      console.log(createOrUpdateResult);

      const categories = await prisma.product.findMany({
        distinct: "category",
        select: {
          category: true,
        },
      });

      // สร้างหรืออัปเดตข้อมูลหมวดหมู่ในลักษณะเดียวกัน
      const newCat = await prisma.category.createMany({
        data: categories.map((cat) => ({
          name: cat.category,
        })),
        skipDuplicates: true, // ข้ามข้อมูลที่มีอยู่ในระบบแล้ว
      });
      console.log(newCat);
    } catch (error) {
      console.log(error);
    }
  });
};
