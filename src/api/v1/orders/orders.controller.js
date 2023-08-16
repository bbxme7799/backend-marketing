import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";

const prisma = new PrismaClient();
export const ordering = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const items = await prisma.cartItem.findMany({
      where: { user_id: userId },
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
            return { ...item, order: Math.floor(Math.random() * 1000) };
          }
        } catch (error) {
          return { ...item, error: true };
        }
      })
    );
    console.log("orderItems=> ", orderItems);
    await prisma.order.create({
        data:{
            user_id:userId,
            
        }
    })
    res.json({
      data: orderItems,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
