import { BadRequestException } from "../../../exceptions/bad-request.exception.js";
import { NotFoundRequestException } from "../../../exceptions/not-found-request.exception.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addToCart = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { prodId } = req.params;
    const { quantity, url } = req.body;

    const product = await prisma.product.findFirst({
      where: { service: prodId },
    });
    if (!product) throw new NotFoundRequestException();
    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: id },
    });
    const cartItem = cartItems.find(
      (cartItem) => cartItem.product_id === prodId && cartItem.url === url
    );
    if (cartItem) {
      console.log(cartItem);
      const newQuantity = quantity + cartItem.quantity;
      const mod = newQuantity % product.step;
      console.log(newQuantity, mod);
      if (mod !== 0) throw new BadRequestException("Invalid quantity");
      if (newQuantity > product.max || newQuantity < product.min)
        throw new BadRequestException("Out of stock");
      const newItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { url, quantity: newQuantity },
      });
      res.status(201).json(newItem);
      return;
    }

    const mod = quantity % product.step;
    if (mod !== 0) throw new BadRequestException("Invalid quantity");
    if (quantity > product.max || quantity < product.min)
      throw new BadRequestException("Out of stock");
    const newItem = await prisma.cartItem.create({
      data: {
        url,
        quantity,
        product: {
          connect: { service: product.service },
        },
        user: {
          connect: { id },
        },
      },
    });
    res.status(201).json(newItem);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const editCartItem = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { itemId } = req.params;
    const { quantity, url } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { user_id: id },
    });

    const cartItem = cartItems.find((cartItem) => cartItem.id === itemId);
    if (!cartItem) throw new BadRequestException("Item not exist");
    const isDuplicate = cartItems.some(
      (tmpCartItem) =>
        tmpCartItem.id !== itemId &&
        tmpCartItem.product_id === cartItem.product_id &&
        tmpCartItem.url === url
    );
    if (isDuplicate) throw new BadRequestException("Item is exist");

    const product = await prisma.product.findFirst({
      where: { service: cartItem.product_id },
    });
    if (!product) throw new NotFoundRequestException();

    const mod = quantity % product.step;
    if (mod !== 0) throw new BadRequestException("Invalid quantity");
    if (quantity > product.max || quantity < product.min)
      throw new BadRequestException("Out of stock");
    const newItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { url, quantity },
    });
    res.json(newItem);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const { itemId } = req.params;
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId, user_id: id },
    });
    if (!item) throw new BadRequestException("Item not found");
    const deleted = await prisma.cartItem.delete({
      where: { user_id: id, id: itemId },
    });
    res.json(deleted);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getCartItems = async (req, res, next) => {
  try {
    const { id } = req.currentUser;
    const carItems = await prisma.cartItem.findMany({
      where: { user_id: id },
      include: {
        product: {
          select: {
            name: true,
            step: true,
            rate: true,
            max: true,
            min: true,
            service: true,
          },
        },
        // product: true
      },
    });
    const idToDelete = carItems
      .filter(
        (cartItem) =>
          !cartItem.product ||
          cartItem.quantity > cartItem.product.max ||
          cartItem.quantity < cartItem.product.min
      )
      .map((cartItem) => cartItem.id);
    if (idToDelete.length > 0) {
      await prisma.cartItem.deleteMany({ where: { id: { in: idToDelete } } });
      const carItems = await prisma.cartItem.findMany({
        where: { user_id: id },
        include: {
          product: {
            select: {
              name: true,
              step: true,
              rate: true,
              max: true,
              min: true,
              service: true,
            },
          },
        },
      });
      res.json(carItems);
      return;
    }
    res.json(carItems);
    return;
  } catch (error) {
    console.log(error);
    next(error);
  }
};
