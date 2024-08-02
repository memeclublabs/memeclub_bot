import { MemeMasterDeployParam } from "./ton/ton.interfaces";
import { getWalletContract } from "./ton/clientAndWallet";
import { Cell } from "@ton/core";
import { getMemeDexBase64 } from "./ton/compileContract";
import { getMemeMasterAddressAndInit } from "./ton/initContract";
import { initDeployMemeMaster } from "./ton/dex/MemeDex";
import { toTonAddressStr } from "../com.utils";

export async function tonDeployMaster(
  name: string,
  ticker: string,
  description: string,
  imageUrl: string,
) {
  //1.加载平台钱包
  let { wallet_contract: opWallet, secretKey: user1_secretKey } =
    await getWalletContract(1); //platform address

  //2.加载meme-master和meme-wallet的合约code
  let compile_codes = getMemeDexBase64();
  let memeMasterCode = Cell.fromBase64(compile_codes.meme_master!);
  let jettonWalletCode = Cell.fromBase64(compile_codes.meme_wallet!);

  let memeMasterDeployParam: MemeMasterDeployParam = {
    jetton_name: name,
    jetton_description: description,
    jetton_symbol: ticker,
    image_url: imageUrl,
    max_supply: "1000000000", //1 billion,10 亿 token
    admin_address: opWallet.address,
    jetton_wallet_code: jettonWalletCode,
    tx_fee_numerator: 500, //1000/10000,即10%卖出手续费
    curve_type: 1, //1: 线性函数  y= a*x/10^9 + b  5:友好型S函数
    param_a: 4, // param_a 越小，token价格越低，1TON可以买2.2万个token
    param_b: 0,
    param_c: 0,
    meme_master_code: memeMasterCode,
  };

  let { deployMasterContractAddress, master_init } =
    await getMemeMasterAddressAndInit(memeMasterDeployParam);

  console.log(
    "deploy MemeMaster Contract Address :",
    deployMasterContractAddress,
  );

  // ****************2.deploy contract
  let query_id = 0n;
  let master_seqno = await initDeployMemeMaster(
    opWallet,
    user1_secretKey,
    deployMasterContractAddress,
    master_init,
    query_id,
    "0.02",
  );
  // await waitNextSeqNo(opWallet, master_seqno);
  // await sleep(15000);

  return {
    opWallet: opWallet,
    masterAddress: toTonAddressStr(deployMasterContractAddress),
    seqNo: master_seqno,
  };
}
