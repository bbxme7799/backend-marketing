import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const topup = async (req, res, next) => {
  try {
    const { address } = req.body;
    const user = req.currentUser;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        address_for_paid: address,
      },
    });
    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
