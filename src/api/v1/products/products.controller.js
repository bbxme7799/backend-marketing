import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getAllProducts = async (req, res, next) => {
  try {
    const { keyword, category, page, per_page } = req.query;
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: keyword,
        },
        category: {
          contains: category,
        },
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.product.count({
      where: {
        name: {
          contains: keyword,
        },
        category: {
          contains: category,
        },
      },
    });
    res.json({
      data: products,
      page,
      per_page,
      total_page: Math.ceil(total / per_page),
      total,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
