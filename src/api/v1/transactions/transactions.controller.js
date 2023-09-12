import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTransctions = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.transaction.count({});
    res.json({
      data: transactions,
      page,
      per_page,
      total_page: Math.ceil(total / per_page),
      total,
    });
    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
