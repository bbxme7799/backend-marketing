import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const me = async (req, res, next) => {
  try {
    const user = req.currentUser;
    const result = await prisma.user.findUnique({
      where: { id: user?.id },
      select: { email: true, id: true, username: true ,role:true},
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
