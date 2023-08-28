import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";
import axios from "axios";

const prisma = new PrismaClient();
export const ordering = async (req, res, next) => {
  try {
    const { id } = req.currentUser;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) throw new BadRequestException("User not foud.");

    const items = await prisma.cartItem.findMany({
      where: { user_id: id },
      include: {
        product: true,
      },
    });

    if (!items || items.length <= 0)
      throw new BadRequestException("No item in cart.");
    //cut balance
    const totalUnCut = items.reduce(
      (prev, acc) => ((acc.product.rate * 1.5) / 1000) * acc.quantity + prev,
      0
    );

    if (totalUnCut > user.balance || user.balance - totalUnCut < 0)
      throw new BadRequestException("Insufficient balance");

    const orderItems = await Promise.all(
      items.map(async (item, index) => {
        try {
          const response = await axios.get(
            `https://iplusview.store/api?key=445ffcff1322193be0a307e4a8918716&action=add&service=${item.product_id}&link=${item.url}&quantity=${item.quantity}`
          );

          const { order, error } = response.data;
          // console.log("order=>", response.data);
          return {
            ...item,
            order,
            error: error ? true : false,
          };
        } catch (error) {
          console.log(error);
          return { ...item, error: true };
        }
      })
    );

    console.log("orderItems=> ", orderItems);
    const total = orderItems.reduce(
      (prev, acc) =>
        acc.error
          ? 0 + prev
          : ((acc.product.rate * 1.5) / 1000) * acc.quantity + prev,
      0
    );

    const order = await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: total },
        orders: {
          create: {
            order_items: {
              createMany: {
                data: orderItems.map((orderItem) => ({
                  ref_id: orderItem?.order ? orderItem?.order : null,
                  service_name: orderItem.product.name,
                  is_paid: !orderItem.error,
                  price:
                    ((orderItem.product.rate * 1.5) / 1000) *
                    orderItem.quantity,
                  quantity: orderItem.quantity,
                  status: orderItem.error ? "Canceled" : "Pending",
                })),
              },
            },
          },
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { user_id: user.id },
    });

    // const order = await prisma.order.create({
    //   data: {
    //     user_id: id,
    //     total,
    //     order_items: {
    //       createMany: {
    //         data: orderItems.map((orderItem) => ({
    //           ref_id: orderItem?.order ? orderItem?.order : null,
    //           service_name: orderItem.product.name,
    //           is_paid: !orderItem.error,
    //           price:
    //             ((orderItem.product.rate * 1.5) / 1000) * orderItem.quantity,
    //           quantity: orderItem.quantity,
    //           status: orderItem.error ? "Canceled" : "Pending",
    //         })),
    //       },
    //     },
    //   },
    // });
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
        if (
          orderItem.ref_id === null ||
          !orderItem.is_paid ||
          orderItem.status === "Refund"
        )
          return orderItem;
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
        // if (orderItem.ref_id === null && !orderItem.is_paid) return orderItem;
        if (
          orderItem.ref_id === null ||
          !orderItem.is_paid ||
          orderItem.status === "Refund"
        )
          return orderItem;
        //request here to get status and update
        const response = await axios.get(
          `https://iplusview.store/api?key=445ffcff1322193be0a307e4a8918716&action=status&order=${orderItem.ref_id}`
        );
        const { status } = response.data;
        // refund  refund credit to customer
        return await prisma.orderItem.update({
          where: { id: orderItem.id },
          data: { status: status },
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

export const getAllOrders = async (req, res, next) => {
  try {
    // ดึงข้อมูล orders พร้อม order_items ที่เกี่ยวข้อง
    const ordersWithItems = await prisma.order.findMany({
      include: {
        order_items: true,
      },
    });

    // ส่งข้อมูล orders กลับไปให้ Client
    res.json({
      data: ordersWithItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
