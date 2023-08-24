import cron from "node-cron";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const refundSchedule = async () => {
  //every 1 minitue
  cron.schedule("*/1 * * * *", async () => {
    // cron.schedule("0 0 * * *", async () => {
    try {
      console.log("------- start refund schedule -------");

      const orderItems = await prisma.orderItem.findMany({
        where: {
          NOT: {
            AND: [
              { status: "Canceled", is_paid: true },
              { status: "Completed", is_paid: true },
              { status: "Partial", is_paid: true },
              { status: "Refund", is_paid: true },
            ],
            ref_id: null,
          },
          is_paid: true,
        },
        //condition for get important status to update
      });
      console.log("orderItems =>", orderItems);
      const newOrderItems = await Promise.all(
        orderItems.map(async (orderItem) => {
          if (orderItem.ref_id === null || !orderItem.is_paid) return orderItem;
          //request here to get status and update

          //request here to get status and update
          const response = await axios.get(
            `https://iplusview.store/api?key=445ffcff1322193be0a307e4a8918716&action=status&order=${orderItem.ref_id}`
          );
          const { status } = response.data;
          return await prisma.orderItem.update({
            where: { id: orderItem.id },
            data: { status: status },
          });
        })
      );
      // const refundItems = newOrderItems.filter(
      //   (orderItem) => orderItem.status === "ex refund"
      // ); //if refund true

      const refundItems = await prisma.orderItem.findMany({
        where: {
          OR: [
            { status: "Canceled", is_paid: true },
            // { status: "Completed", is_paid: true },
            { status: "Partial", is_paid: true },
          ],
          NOT: { ref_id: null },
        },
      });

      //refund and update balance user here

      await Promise.all(
        refundItems.map(async (item) => {
          return await prisma.orderItem.update({
            where: { id: item.id },
            data: {
              status: "Refund",
              order: {
                update: {
                  data: {
                    total: { decrement: item.price },

                    user: { update: { balance: { increment: item.price } } },
                  },
                  // user: { update: { balance: { increment: item.price } } }, //update balance here
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
