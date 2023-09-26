import { ethers } from "ethers";
// import busdContractJson from "../contracts/busd.contract.json" assert { type: "json" };
import busdContractJson from "../../../contracts/busd.contract.json" assert { type: "json" };
const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const contractAddress = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
const contractABI = busdContractJson;
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const withdraw = async (address, wei) => {
  try {
    const tx = await contract.transfer(address, wei);
    await tx.wait();
    console.log("Transaction Hash:", tx.hash);
    console.log("Transfer successful.");
  } catch (error) {
    console.log(error);
    throw error;
  }
};
