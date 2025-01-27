import { ethers, Contract } from "ethers";
import { parseUnits } from "ethers";
import { readFile } from 'fs/promises';

// import ABI from './contracts/abi/RealmToken.json';
const filePath = new URL('./contracts/abi/RealmToken.json', import.meta.url);
const token = await readFile(filePath, { encoding: 'utf-8' });

const RPC_URL=process.env.BASE_SEPOLIA_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY as string;
const provider = new ethers.JsonRpcProvider(RPC_URL);
let signer: any = null;

function initSigner() {
    signer = new ethers.Wallet(PRIVATE_KEY, provider)
}

export async function getNetwork() {
    const network = await provider.getNetwork();
    console.log(`connected to ethereum network: ${network.name}, id: ${network.chainId}`);
    console.log(`private key: ${(!PRIVATE_KEY || PRIVATE_KEY === '') ? 'running without a private' : 'signer has a private key'}`);
}

export async function getLatestBlock() {
    const latestBlock = await provider.getBlockNumber();
    console.log(latestBlock);
}

function getContract() {
    let contract: Contract;
    if (!PRIVATE_KEY || PRIVATE_KEY === '') { // private key is not defined
        console.log(`No private key found. Using provider instead of signer.`);
        contract = new Contract(process.env.CONTRACT_ADDRESS as string, token, provider);
    }
    else if (!signer) { // private key is defined
        console.log(`Private key found. Initializing signer.`);
        try {
            initSigner();
            contract = new Contract(process.env.CONTRACT_ADDRESS as string, token, signer);
        }
        catch (e) {
            console.log(`Error: ${e}`);
            contract = new Contract(process.env.CONTRACT_ADDRESS as string, token, provider);
        }
    }
    else { // private key is defined and signer is already initialized
        contract = new Contract(process.env.CONTRACT_ADDRESS as string, token, signer);
    }
    return contract;
}

export async function sendPayment(address: string, amount: number) {
    const contract = getContract();
    if (signer === null) {
        console.log(`Cannot send payment without a signer. Please provide a private key.`);
    }
    else {
        try {
            const tx = await contract.transfer(address, parseUnits(amount.toString(), 18));
            console.log(`Transaction hash: ${tx.hash}`);
        }
        catch (e) {
            console.log(`Error sending transaction: ${e}`);
        } 
    }
};