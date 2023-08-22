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
  const ownerAddress = "0x57382616659eF9A38100537eE46097a69cD48d90";

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
      //   const data: { THB: number } = await (await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=THB")).data
      //   const rateInTHB = data.THB;
      const rateInTHB = busdRate.rate;
      //   const rate = (1 * 10 ** 18) / rateInTHB;
      //   const toWei = rate * priceTHB;
      const rate2 = rateInTHB / (1 * 10 ** 18);
      const bath = Number(payload[2]) * rate2;

      //   return {
      // wei: Math.ceil(toWei),
      //   };
      console.log({ bath });
      console.log(event);
    }
  );
};
