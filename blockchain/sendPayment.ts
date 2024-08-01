import { ethers } from "ethers";
import { parseUnits } from "ethers";
import { Wallet } from "ethers/wallet";
import { readFile } from 'fs/promises';

// import ABIs
const filePath = new URL('../contracts/abi/EtherGramStore.json', import.meta.url);
// const store = JSON.parse(await readFile(filePath, { encoding: 'utf-8' }));
const store = await readFile(filePath, { encoding: 'utf-8' });

const RPC_URL=process.env.BASE_SEPOLIA_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY as string;
export const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

export async function getNetwork() {
    const network = await provider.getNetwork();
    console.log(`connected to ethereum network: ${network.name}, id: ${network.chainId}`);
}

export async function getLatestBlock() {
    const latestBlock = await provider.getBlockNumber();
    console.log(latestBlock);
  }

export async function sendPayment(address: string, amount: number) {
  const wallet = Wallet.createRandom();
  const tx = {
    to: address,
    value: parseUnits(amount.toString(), "ether"),
    };
    const signedTx = await wallet.signTransaction(tx);
    const txResponse = await signer.sendTransaction(signedTx);
    return txResponse;
};