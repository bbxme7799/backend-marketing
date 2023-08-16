import cron from "node-cron";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const refundSchedule = async () => {
  //every 1 minitue
  cron.schedule("*/1 * * * *", async () => {
    try {
      console.log("------- start refund schedule -------");

      const orderItems = await prisma.orderItem.findMany({
        //condition for get important status to update
      });
      const newOrderItems = await Promise.all(
        orderItems.map(async (orderItem) => {
          if (orderItem.ref_id === null && !orderItem.is_paid) return orderItem;
          //request here to get status and update
          return await prisma.orderItem.update({
            where: { id: orderItem.id },
            data: { status: "" },
          });
        })
      );
      const refundItems = newOrderItems.filter(
        (orderItem) => orderItem.status === "ex refund"
      ); //if refund true

      //refund and update balance user here

      await Promise.all(
        refundItems.map(async (item) => {
          return await prisma.orderItem.update({
            where: { id: item.id },
            data: {
              order: {
                update: {
                  data: { total: { decrement: item.price } },
                  // user: { update: {} }, //update balance here
                },
              },
            },
          });
        })
      );

      console.log("------- finished refund schedule -------");
    } catch (error) {
      console.log(error);
    }
  });
};
