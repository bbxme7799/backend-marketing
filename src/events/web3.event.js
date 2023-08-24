import { ethers } from "ethers";

import busdContractJson from "../contracts/busd.contract.json" assert { type: "json" };
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const contractABI = busdContractJson;
const contract = new ethers.Contract(contractAddress, contractABI, provider);

export const transferEvent = () => {
  const ownerAddress = "0xF66D753De15379B0B445df6956356d18A1B47e1F";

  contract.on(
    contract.filters.Transfer(null, ownerAddress),
    async (from, to, value, event) => {
      console.log(
        `Transfer event received - From: ${from}, To: ${to}, Value: ${value}`
      );
      console.log(from.log.args);
      const payload = from.log.args;
      console.log(payload[0], payload[1], payload[2]);
      const busdRate = await prisma.uSD_rate.findFirst();
      console.log(busdRate.rate, Number(payload[2]));
      const rateInTHB = busdRate.rate;
      const rate2 = rateInTHB / (1 * 10 ** 18);
      const bath = Number(payload[2]) * rate2;

      console.log({ bath });
      const eUser = await prisma.user.findFirst({
        where: { address_for_paid: payload[0] },
      });
      const user = await prisma.user.update({
        where: { id: eUser.id },
        data: { balance: { increment: bath } },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { address_for_paid: null },
        });
      }
      console.log(event);
    }
  );
};
