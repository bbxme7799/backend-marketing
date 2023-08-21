import { PrismaClient } from "@prisma/client";
import { NotFoundRequestException } from "../../../exceptions/not-found-request.exception.js";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";
import { string } from "zod";

const prisma = new PrismaClient();

export const createProduct = async (req, res, next) => {
  try {
    const { id, name, rate, min, max, description, category } = req.body;

    const product = await prisma.product.findUnique({
      where: { service: parseInt(id) },
    });

    if (product) throw new BadRequestException("Service id  already exist.");

    const createdProduct = await prisma.product.create({
      data: {
        service: parseInt(id),
        name,
        rate: parseFloat(rate),
        min: parseInt(min),
        max: parseInt(max),
        description,
        category,
        step: parseInt(1000),
        type: "Default",
        average_delivery: "1 ชั่วโมง",
        dripfeed: false,
        refill: false,
      },
    });

    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { keyword, category, page, per_page } = req.query;
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: keyword,
                },
              },
              {
                category: {
                  contains: keyword,
                },
              },
            ],
          },
          {
            category: {
              contains: category,
            },
          },
        ],
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.product.count({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: keyword,
                },
              },
              {
                category: {
                  contains: keyword,
                },
              },
            ],
          },
          {
            category: {
              contains: category,
            },
          },
        ],
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

export const editProduct = async (req, res, next) => {
  try {
    const { name, category, description, rate, min, max } = req.body;
    const { id } = req.params; // Use 'id' instead of 'serviceId'

    const product = await prisma.product.findUnique({
      where: { service: parseInt(id) }, // Convert to integer here
    });
    // if (!product) throw new NotFoundRequestException();
    // if (product.name == name)
    //   throw new BadRequestException("ข้อมูลชื่อบริการซ้ำ");

    const result = await prisma.product.update({
      where: { service: parseInt(id) }, // Convert to integer here
      data: {
        name,
        category,
        description,
        rate: parseFloat(rate),
        min: parseInt(min),
        max: parseInt(max),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { service: parseInt(id) },
    });

    if (!product) throw new NotFoundRequestException();

    const result = await prisma.product.delete({
      where: { service: parseInt(id) },
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
