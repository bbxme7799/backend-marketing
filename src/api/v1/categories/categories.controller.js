import { PrismaClient } from "@prisma/client";
import { NotFoundRequestException } from "../../../exceptions/not-found-request.exception.js";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";

const prisma = new PrismaClient();
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingCategory = await prisma.category.findFirst({
      where: { name }, // Query by name instead of findUnique
    });

    if (existingCategory) {
      throw new BadRequestException("Category already exists.");
    }

    const result = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { catId } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: catId },
    });
    if (!category) throw new NotFoundRequestException();
    if (category && category.name === name)
      throw new BadRequestException("Category already exist.");

    const result = await prisma.category.update({
      where: { id: catId },
      data: {
        name,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { catId } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: catId },
    });

    if (!category) throw new NotFoundRequestException();

    const result = await prisma.category.delete({
      where: { id: catId },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getAllCategories = async (req, res, next) => {
  try {
    const { keyword, page, per_page } = req.query;

    const categories = await prisma.category.findMany({
      where: {
        name: {
          contains: keyword,
        },
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.category.count({
      where: {
        name: {
          contains: keyword,
        },
      },
    });
    res.json({
      data: categories,
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
