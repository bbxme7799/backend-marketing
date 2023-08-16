import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";

const prisma = new PrismaClient();
export const ordering = async (req, res, next) => {
  try {
    const { id } = req.currentUser;

    const items = await prisma.cartItem.findMany({
      where: { user_id: id },
      include: {
        product: true,
      },
    });
    if (!items || items.length <= 0)
      throw new BadRequestException("No item in cart.");
    const orderItems = await Promise.all(
      items.map(async (item, index) => {
        try {
          if (index === 0) {
            // request here

            throw new Error("tests");
          } else {
            return {
              ...item,
              order: Math.floor(Math.random() * 1000),
              error: false,
            };
          }
        } catch (error) {
          return { ...item, error: true };
        }
      })
    );
    console.log("orderItems=> ", orderItems);
    const total = orderItems.reduce(
      (prev, acc) =>
        acc.error ? 0 + prev : (acc.product.rate / 1000) * acc.quantity + prev,
      0
    );
    const order = await prisma.order.create({
      data: {
        user_id: id,
        total,
        order_items: {
          createMany: {
            data: orderItems.map((orderItem) => ({
              ref_id: orderItem?.order ? orderItem?.order : null,
              service_name: orderItem.product.name,
              is_paid: !orderItem.error,
              price: (orderItem.product.rate / 1000) * orderItem.quantity,
              quantity: orderItem.quantity,
            })),
          },
        },
      },
    });
    res.json({
      data: order,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOneMyOrder = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { orderId } = req.params;
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { user_id: id }, order_id: orderId },
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

    // const refundItems = newOrderItems.filter(
    //   (orderItem) => orderItem.status === "ex refund"
    // ); //if refund true

    // //refund and update balance user here

    // await Promise.all(
    //   refundItems.map(async (item) => {
    //     return await prisma.orderItem.update({
    //       where: { id: item.id },
    //       data: {
    //         order: {
    //           update: {
    //             data: { total: { decrement: item.price } },
    //             // user: { update: {} }, //update balance here
    //           },
    //         },
    //       },
    //     });
    //   })
    // );
    res.json({
      data: newOrderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getMyOrders = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { user_id: id } },
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

    // const refundItems = newOrderItems.filter(
    //   (orderItem) => orderItem.status === "ex refund"
    // ); //if refund true

    // //refund and update balance user here

    // await Promise.all(
    //   refundItems.map(async (item) => {
    //     return await prisma.orderItem.update({
    //       where: { id: item.id },
    //       data: {
    //         order: {
    //           update: {
    //             data: { total: { decrement: item.price } },
    //             // user: { update: {} }, //update balance here
    //           },
    //         },
    //       },
    //     });
    //   })
    // );

    console.log(newOrderItems);
    const orders = await prisma.order.findMany({ where: { user_id: id } });
    res.json({
      data: orders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
