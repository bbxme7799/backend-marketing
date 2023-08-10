import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const me = async (req, res, next) => {
  try {
    const user = req.currentUser;
    const result = await prisma.user.findUnique({
      where: { id: user?.id },
      select: {
        email: true,
        id: true,
        google_id: true,
        username: true,
        role: true,
      },
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateUsername = async (req, res, next) => {
  try {
    const user = req.currentUser;
    const { newUsername } = req.body;

    // Check if the new username is already taken
    const existingUserWithUsername = await prisma.user.findFirst({
      where: { username: newUsername },
    });

    if (existingUserWithUsername) {
      throw new BadRequestException("Username is already taken.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user?.id },
      data: { username: newUsername },
    });

    const result = {
      email: updatedUser.email,
      id: updatedUser.id,
      google_id: updatedUser.google_id,
      username: updatedUser.username,
      role: updatedUser.role,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
