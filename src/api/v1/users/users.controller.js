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
        is_banned: true,
        address: true,
        balance: true,
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
    // const existingUserWithUsername = await prisma.user.findFirst({
    //   where: { username: newUsername },
    // });

    // if (existingUserWithUsername) {
    //   throw new BadRequestException("Username is already taken.");
    // }

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

export const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 0,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

// controllers/admin.controller.js

export const banOrUnbanUser = async (req, res, next) => {
  try {
    const { userId, action } = req.body;

    if (action === "ban") {
      // Ban the user by updating is_banned to true
      await prisma.user.update({
        where: { id: userId },
        data: { is_banned: true },
      });

      res.json({ message: "User has been banned successfully." });
    } else if (action === "unban") {
      // Unban the user by updating is_banned to false
      await prisma.user.update({
        where: { id: userId },
        data: { is_banned: false },
      });

      res.json({ message: "User has been unbanned successfully." });
    } else {
      throw new Error("Invalid action.");
    }
  } catch (error) {
    console.error("Error banning/unbanning user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
};
