import {
  Address,
  Cell,
  fromNano,
  internal,
  OpenedContract,
  toNano,
  TupleBuilder,
} from "@ton/core";
import { WalletContractV4 } from "@ton/ton";
import {
  buildBuyTokenMsg,
  buildDeployMemeMasterMsg,
} from "./message/masterMsg";
import { buildBurnTokenMsg } from "./message/walletMsg";
import { client2 } from "../clientAndWallet";

export async function initDeployMemeMaster(
  wallet_contract: OpenedContract<WalletContractV4>,
  secretKey: Buffer,
  deployContractAddress: Address,
  state_init: { code: Cell; data: Cell },
  query_id: bigint,
  amountStr: string,
) {
  // ========================================
  let deployAmount = toNano(amountStr); //0.1 or 0.2
  let seqno: number = await wallet_contract.getSeqno();
  let balance: bigint = await wallet_contract.getBalance();

  // ========================================
  console.log("================ " + seqno + " ======================== ");
  console.log(
    "Current deployment wallet balance: ",
    fromNano(balance).toString(),
    "💎TON",
  );
  console.log(
    "Deploying MemeMaster contract to address: ",
    deployContractAddress,
  );

  await wallet_contract.sendTransfer({
    seqno,
    secretKey,
    messages: [
      internal({
        to: deployContractAddress,
        value: deployAmount,
        init: { code: state_init.code, data: state_init.data },
        bounce: true,
        body: buildDeployMemeMasterMsg(query_id),
      }),
    ],
  });

  return seqno;
}

export async function initBuyMemeToken(
  wallet_contract: OpenedContract<WalletContractV4>,
  secretKey: Buffer,
  deployContractAddress: Address,
  query_id: bigint,
  buy_amount: number,
  gasAmount: bigint,
) {
  // ========================================
  let seqno: number = await wallet_contract.getSeqno();
  let balance: bigint = await wallet_contract.getBalance();

  // ========================================
  console.log("================ " + seqno + " ======================== ");
  console.log(
    "Current deployment wallet balance: ",
    fromNano(balance).toString(),
    "💎TON",
  );
  console.log(
    "Buy Meme token from Meme Master contract: ",
    deployContractAddress,
  );

  await wallet_contract.sendTransfer({
    seqno,
    secretKey,
    messages: [
      internal({
        to: deployContractAddress,
        value: gasAmount,
        bounce: true,
        body: buildBuyTokenMsg(buy_amount, query_id),
      }),
    ],
  });

  return seqno;
}

export async function initSellMemeToken(
  wallet_contract: OpenedContract<WalletContractV4>,
  secretKey: Buffer,
  deployContractAddress: Address,
  query_id: bigint,
  sell_amount: number,
  response_address: Address,
  gasAmount: bigint,
) {
  // ========================================
  let seqno: number = await wallet_contract.getSeqno();
  let balance: bigint = await wallet_contract.getBalance();

  // ========================================
  console.log("================ " + seqno + " ======================== ");
  console.log(
    "Current deployment wallet balance: ",
    fromNano(balance).toString(),
    "💎TON",
  );
  console.log(
    "Sell Meme token from Meme Wallet contract(By send burn token msg): ",
    deployContractAddress,
  );

  await wallet_contract.sendTransfer({
    seqno,
    secretKey,
    messages: [
      internal({
        to: deployContractAddress,
        value: gasAmount,
        bounce: true,
        body: buildBurnTokenMsg(sell_amount, response_address, query_id),
      }),
    ],
  });

  return seqno;
}

export async function getBuyPrice(
  memeMasterContract: Address,
  buy_amount: bigint,
) {
  let builder = new TupleBuilder();
  builder.writeNumber(buy_amount);
  const get_buy_price_tx = await client2.runMethod(
    memeMasterContract,
    "get_buy_price",
    builder.build(),
  );
  let source = get_buy_price_tx.stack;
  let result = source.readBigNumber();
  return result;
}

export async function getSellPrice(
  memeMasterContract: Address,
  sell_amount: bigint,
) {
  let builder = new TupleBuilder();
  builder.writeNumber(sell_amount);
  const get_sell_price_tx = await client2.runMethod(
    memeMasterContract,
    "get_sell_price",
    builder.build(),
  );
  let source = get_sell_price_tx.stack;
  let result = source.readBigNumber();
  return result;
}
