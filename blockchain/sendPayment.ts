import { ethers, Contract } from "ethers";
import { parseUnits } from "ethers";
import { readFile } from 'fs/promises';

// import ABI from './contracts/abi/RealmToken.json';
const filePath = new URL('./contracts/abi/RealmToken.json', import.meta.url);
const token = await readFile(filePath, { encoding: 'utf-8' });

const RPC_URL=process.env.BASE_SEPOLIA_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY as string;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export async function getNetwork() {
    const network = await provider.getNetwork();
    console.log(`connected to ethereum network: ${network.name}, id: ${network.chainId}`);
}

export async function getLatestBlock() {
    const latestBlock = await provider.getBlockNumber();
    console.log(latestBlock);
}

function getContract() {
    const contract = new Contract(process.env.CONTRACT_ADDRESS as string, token, signer);
    return contract;
}

export async function sendPayment(address: string, amount: number) {
  const tx = await getContract().transfer(address, parseUnits(amount.toString(), 18));
  console.log(`Transaction hash: ${tx.hash}`);
};