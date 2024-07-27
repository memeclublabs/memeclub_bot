import { Sha256 } from "@aws-crypto/sha256-js";
import { beginCell, Cell, Dictionary, OpenedContract } from "@ton/core";
import { TonClient4, WalletContractV4 } from "@ton/ton";

const ONCHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;
const CELL_MAX_SIZE_BYTES = Math.floor((1023 - 8) / 8);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAccountLastTransaction(
  user1_wallet: OpenedContract<WalletContractV4>,
  client: TonClient4,
) {
  let seqNo = await user1_wallet.getSeqno();
  console.log("**seqNo:", seqNo);
  let lastBlock = await client.getLastBlock();
  console.log("last block:", lastBlock);
  let res = await client.getAccount(lastBlock.last.seqno, user1_wallet.address);
  console.log("Account info:", res);
  return await client.getAccountTransactions(
    user1_wallet.address,
    BigInt(res.account.last?.lt as string),
    Buffer.from(res.account.last?.hash as string, "base64"),
  );
}
export async function waitNextSeqNo(
  wallet_contract: OpenedContract<WalletContractV4>,
  lastSeqNo: number,
) {
  let nextSeqno: number = lastSeqNo;
  let counter = 0;
  var start = performance.now();
  while (nextSeqno < lastSeqNo + 1) {
    await sleep(100);
    nextSeqno = await wallet_contract.getSeqno();
    counter = counter + 1;
  }
  var end = performance.now();
  var result = (end - start) / 1000;
  console.log("Waited", `${result}s`, ",queried ", counter, "times");
}

const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
};

const toKey = (key: string) => {
  return BigInt(`0x${sha256(key).toString("hex")}`);
};

export function buildOnchainMetadata(data: {
  name: string;
  description: string;
  image: string;
}): Cell {
  let dict = Dictionary.empty(
    Dictionary.Keys.BigUint(256),
    Dictionary.Values.Cell(),
  );

  // Store the on-chain metadata in the dictionary
  Object.entries(data).forEach(([key, value]) => {
    dict.set(toKey(key), makeSnakeCell(Buffer.from(value, "utf8")));
  });

  return beginCell()
    .storeInt(ONCHAIN_CONTENT_PREFIX, 8)
    .storeDict(dict)
    .endCell();
}

export function makeSnakeCell(data: Buffer) {
  // Create a cell that package the data
  let chunks = bufferToChunks(data, CELL_MAX_SIZE_BYTES);

  const b = chunks.reduceRight((curCell, chunk, index) => {
    if (index === 0) {
      curCell.storeInt(SNAKE_PREFIX, 8);
    }
    curCell.storeBuffer(chunk);
    if (index > 0) {
      const cell = curCell.endCell();
      return beginCell().storeRef(cell);
    } else {
      return curCell;
    }
  }, beginCell());
  return b.endCell();
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
  let chunks: Buffer[] = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize));
    buff = buff.slice(chunkSize);
  }
  return chunks;
}
