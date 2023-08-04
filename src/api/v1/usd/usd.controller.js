import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getUsd = async (req, res, next) => {
  try {
    const products = await prisma.uSD_rate.findMany({});
    res.json({
      rate: products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
