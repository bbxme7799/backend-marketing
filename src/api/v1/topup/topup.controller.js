import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const topup = async (req, res, next) => {
  try {
    const { txHash } = req.body;
    const user = req.currentUser;
    await prisma.topup.create({
      data: {
        tx_hash: txHash,
        user_id: user.id,
      },
    });
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: {
    //     address_for_paid: address,
    //   },
    // });
    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const totalReport = async (req, res, next) => {
  try {
    const result = await prisma.topup.aggregate({
      _sum: {
        amount: true,
      },
    });
    res.json({ data: result._sum });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getTopups = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const topup = await prisma.topup.findMany({
      include: {
        user: true,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.topup.count({});
    res.json({
      data: topup,
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
