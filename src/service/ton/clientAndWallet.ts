import { TonClient, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import TonWeb from "tonweb";

export const user1 = 1,
  user2 = 2,
  user3 = 3,
  airdrop_vault = 4,
  user4 = 4;

let isMainnet = process.env.CHAIN_NETWORK === "Mainnet";

console.log("===============> isMainnet:", isMainnet);

export const client = new TonClient4({
  endpoint: isMainnet
    ? "https://mainnet-v4.tonhubapi.com"
    : "https://sandbox-v4.tonhubapi.com",
  //endpoint: "https://sandbox.tonhubapi.com",
  //endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  // endpoint: 'https://testnet.toncenter.com/api/v4/jsonRPC',
});

export const client2 = new TonClient({
  endpoint: isMainnet
    ? "https://toncenter.com/api/v2/jsonRPC"
    : "https://testnet.toncenter.com/api/v2/jsonRPC",
  apiKey: "5ffbbb8d775362f8333f2767b530c643ed99a6e13950fcb3dc9137e4863f81fb",
  timeout: 60000, // 60s 超时
});

//use API token ,has 10 TPS
export const tonweb = new TonWeb(
  new TonWeb.HttpProvider(
    isMainnet
      ? "https://toncenter.com/api/v2/jsonRPC"
      : "https://testnet.toncenter.com/api/v2/jsonRPC",
    {
      apiKey:
        "5ffbbb8d775362f8333f2767b530c643ed99a6e13950fcb3dc9137e4863f81fb",
    },
  ),
);

// https://github.com/ton-community/ton-api-v4
// export const ENDPOINT_MAINNET_V4: string = 'https://mainnet-v4.tonhubapi.com';
// export const ENDPOINT_TESTNET_V4: string = 'https://sandbox-v4.tonhubapi.com';

// export const ENDPOINT_MAINNET_RPC: string = 'https://mainnet.tonhubapi.com/jsonRPC';
// export const ENDPOINT_TESTNET_RPC: string = 'https://sandbox.tonhubapi.com/jsonRPC';

export async function getWalletContract(userid: number) {
  let keyPair = await getWalletKeyPair(userid);
  let secretKey = keyPair.secretKey;
  let workchain = 0;
  let wallet = WalletContractV4.create({
    workchain,
    publicKey: keyPair.publicKey,
  });
  let wallet_contract = client2.open(wallet);

  console.log("WalletContractV4 Wallet address: ", wallet_contract.address);
  return { wallet_contract, secretKey };
}

export async function getWalletKeyPair(userid: number) {
  let mnemonics = "";
  if (userid == user1) {
    mnemonics = (process.env.PHRASES_1 || "").toString(); // 🔴 Change to your own, by creating .env file!
  }
  if (userid == user2) {
    mnemonics = (process.env.PHRASES_2 || "").toString(); // 🔴 Change to your own, by creating .env file!
  }

  return await mnemonicToPrivateKey(mnemonics.split(" "));
}
