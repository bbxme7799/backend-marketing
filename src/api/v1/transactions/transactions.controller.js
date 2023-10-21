import { PrismaClient } from "@prisma/client";
import { BadRequestException } from "../../../exceptions/bad-request.exception.js";
import { withdraw as ethersWithdraw } from "../ethers/ethers.service.js";
const prisma = new PrismaClient();

export const adminGetAllTransctions = async (req, res, next) => {
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
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const adminGetReportTransactions = async (req, res, next) => {
  try {
    const deposit = await prisma.transaction.aggregate({
      where: { status: "DEPOSIT" },
      _sum: {
        amount: true,
      },
    });
    const withdraw = await prisma.transaction.aggregate({
      where: { status: "WITHDRAW" },
      _sum: {
        amount: true,
      },
    });
    const totalDeposit = deposit._sum.amount ?? 0;
    const totalWithdraw = withdraw._sum.amount ?? 0;
    res.json({
      data: {
        totalDeposit,
        totalWithdraw,
        profit: totalDeposit - totalWithdraw,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const userGetAllTransctions = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const user = req.currentUser;
    const transactions = await prisma.transaction.findMany({
      where: {
        user_id: user.id,
      },
      include: {
        user: true,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.transaction.count({
      where: {
        user_id: user.id,
      },
    });
    res.json({
      data: transactions,
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
export const adminGetAllDeposit = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const transactions = await prisma.transaction.findMany({
      where: { status: "DEPOSIT" },
      include: {
        user: true,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.transaction.count({
      where: { status: "DEPOSIT" },
    });
    res.json({
      data: transactions,
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
export const adminGetAllWithdraw = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const transactions = await prisma.transaction.findMany({
      where: { status: "WITHDRAW" },
      include: {
        user: true,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.transaction.count({
      where: { status: "WITHDRAW" },
    });
    res.json({
      data: transactions,
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

export const userRequestToWithdraw = async (req, res, next) => {
  try {
    const { amount, walletPublicKey } = req.body;
    const user = req.currentUser;
    const eUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!eUser) throw new BadRequestException("User not found.");
    const withdraw = await prisma.requestToWithdraw.aggregate({
      where: { user_id: user.id, status: "PENDING" },
      _sum: {
        amount: true,
      },
    });
    console.log(
      "🚀 withdraw:",
      Number(withdraw._sum.amount ?? 0) + Number(amount)
    );
    console.log("🚀~ eUser.balance:", eUser.balance);

    if (Number(withdraw._sum.amount ?? 0) + Number(amount) > eUser.balance)
      throw new BadRequestException("Balance not enough.");
    await prisma.requestToWithdraw.create({
      data: {
        user_id: eUser.id,
        amount,
        wallet_public_key: walletPublicKey,
        status: "PENDING",
      },
    });
    res.json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const userGetAllRequestWithdraw = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const user = req.currentUser;
    const withdraws = await prisma.requestToWithdraw.findMany({
      where: {
        user_id: user.id,
      },
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.requestToWithdraw.count({
      where: {
        user_id: user.id,
      },
    });
    res.json({
      data: withdraws,
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
export const adminGetAllRequestWithdraw = async (req, res, next) => {
  try {
    const { page, per_page } = req.query;
    const withdraws = await prisma.requestToWithdraw.findMany({
      skip: (page - 1) * per_page,
      take: per_page,
    });
    const total = await prisma.requestToWithdraw.count({});
    res.json({
      data: withdraws,
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

export const adminApproveWithdraw = async (req, res, next) => {
  try {
    const { withdrawId } = req.params;
    const withdraw = await prisma.requestToWithdraw.findFirst({
      where: {
        id: withdrawId,
        status: "PENDING",
      },
    });
    if (!withdraw) throw new BadRequestException("Transaction not found.");
    const busdRate = await prisma.uSD_rate.findFirst();
    const rate = (1 * 10 ** 18) / busdRate.rate;
    const toWei = rate * Number(withdraw.amount);

    await ethersWithdraw(withdraw.wallet_public_key, toWei);
    await prisma.transaction.create({
      data: {
        status: "WITHDRAW",
        amount: withdraw.amount,
        user_id: withdraw.user_id,
      },
    });
    await prisma.requestToWithdraw.update({
      where: { id: withdrawId, status: "PENDING" },
      data: {
        status: "APPROVE",
      },
    });
    res.json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const adminRejectWithdraw = async (req, res, next) => {
  try {
    const { withdrawId } = req.params;
    const withdraw = await prisma.requestToWithdraw.findUnique({
      where: {
        id: withdrawId,
      },
    });
    if (!withdraw) throw new BadRequestException("Transaction not found.");
    await prisma.requestToWithdraw.update({
      where: { id: withdrawId, status: "PENDING" },
      data: {
        status: "REJECT",
      },
    });
    res.json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
