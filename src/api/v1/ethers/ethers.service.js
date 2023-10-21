import { ethers } from "ethers";
// import busdContractJson from "../contracts/busd.contract.json" assert { type: "json" };
import busdContractJson from "../../../contracts/busd.contract.json" assert { type: "json" };
const provider = new ethers.JsonRpcProvider(
  "https://bsc.getblock.io/34497ced-d5ee-4060-8a12-e99f8524db64/testnet/"
);
import BigNumber from "bignumber.js";
const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const contractABI = busdContractJson;
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const withdraw = async (address, wei) => {
  try {
    const valueInWei = new BigNumber(wei.toString()); // 1e19 in Wei
    const valueHex = "0x" + valueInWei.toString(16);
    const tx = await contract.transfer(address, valueHex);
    await tx.wait();
    console.log("Transaction Hash:", tx.hash);
    console.log("Transfer successful.");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
