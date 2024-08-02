import * as fs from "fs";
import { Cell } from "@ton/core";
import { compileFunc } from "@ton-community/func-js";
import { client } from "./clientAndWallet";

//source_path:sources
//output_path: ./build/
//output_path(mainnet v1): ./build_mainnet_v1/
//let latest_version="v2";
let latest_version = "v3";
export async function compileFuncFile(
  output_path: string,
  name: string,
  source_path: string = latest_version,
) {
  let result = "";
  const compileResult = await compileFunc({
    targets: ["./sources/" + source_path + "/" + name + ".fc"],
    sources: (x) => fs.readFileSync(x).toString("utf8"),
  });

  if (compileResult.status === "error") {
    console.error(
      "compile " + name + " contract error:",
      compileResult.message,
    );
  } else {
    const contractPath = output_path + name + ".compiled.base64";
    result = Cell.fromBoc(Buffer.from(compileResult.codeBoc, "base64"))[0]
      .toBoc()
      .toString("base64");
    fs.writeFileSync(contractPath, result);
    //output as json
    // fs.writeFileSync(contractPath,JSON.stringify({
    //  base64:result
    // })
    // )
  }
  return result;
}

export function getMemeDexBase64() {
  const meme_master = process.env.CONTRACT_MASTER;
  const meme_wallet = process.env.CONTRACT_JETTON_WALLET;
  return { meme_master, meme_wallet };
}

export async function compileMemeDexFuncFile() {
  let output_path = "./build_meme_dex/";
  let source_path = "meme_dex";
  let meme_master = await compileFuncFile(
    output_path,
    "meme-master-dex",
    source_path,
  );
  let meme_wallet = await compileFuncFile(
    output_path,
    "meme-wallet",
    source_path,
  );
  return { meme_master, meme_wallet };
}

//code_path: ./build/
//code_path(mainnet v1): ./build_mainnet_v1/
export async function getCodeStringFromFile(code_path: string, name: string) {
  const contractPath = code_path + name + ".compiled.base64";
  let result = fs.readFileSync(contractPath);
  return result.toString();
}

export type CompiledCodeList = {
  erc404_collection_code: Cell;
  erc404_nft_item_code: Cell;
  erc404_jetton_wallet_code: Cell;
  erc404_master_code: Cell;
  pink_order_sale?: Cell;
  pink_market?: Cell;
  trc404_upgrade_v1_to_v2?: Cell;
  dex_pool_code?: Cell;
  dex_lp_wallet?: Cell;
  nft_lottery?: Cell;
};

//for new version
export async function getAllCompileCode(output_path?: string) {
  if (output_path == undefined) {
    output_path = "./build/";
  }
  let erc404_collection_code = Cell.fromBase64(
    await compileFuncFile(output_path, "trc404_nftCollection"),
  );
  let erc404_nft_item_code = Cell.fromBase64(
    await compileFuncFile(output_path, "trc404_nftItem"),
  );
  let erc404_jetton_wallet_code = Cell.fromBase64(
    await compileFuncFile(output_path, "trc404_wallet"),
  );
  let erc404_master_code = Cell.fromBase64(
    await compileFuncFile(output_path, "trc404_master"),
  );
  //    let pink_order_sale= Cell.fromBase64(await compileFuncFile(output_path,"pink_order_sale"));
  //    let  pink_market= Cell.fromBase64(await compileFuncFile(output_path,"pink_market"));
  //    let  trc404_upgrade_v1_to_v2= Cell.fromBase64(await compileFuncFile(output_path,"trc404_upgrade_v1_to_v2"));
  //    let  dex_pool_code= Cell.fromBase64(await compileFuncFile(output_path,"trc404_dex_pool"));
  //    let  dex_lp_wallet= Cell.fromBase64(await compileFuncFile(output_path,"trc404_dex_lp_wallet"));
  let nft_lottery = Cell.fromBase64(
    await compileFuncFile(output_path, "nft_lottery"),
  );
  return {
    erc404_collection_code,
    erc404_nft_item_code,
    erc404_jetton_wallet_code,
    erc404_master_code,
    //pink_order_sale,pink_market,trc404_upgrade_v1_to_v2,dex_pool_code,dex_lp_wallet,
    nft_lottery,
  };
}

//for old version
export async function getAllCompileCodeFromFile(code_path: string) {
  let erc404_collection_code = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_nftCollection"),
  );
  let erc404_nft_item_code = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_nftItem"),
  );
  let erc404_jetton_wallet_code = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_wallet"),
  );
  let erc404_master_code = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_master"),
  );
  let pink_order_sale = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "pink_order_sale"),
  );
  let pink_market = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "pink_market"),
  );
  let trc404_upgrade_v1_to_v2 = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "pink_market"),
  );
  let dex_pool_code = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_dex_pool"),
  );
  let dex_lp_wallet = Cell.fromBase64(
    await getCodeStringFromFile(code_path, "trc404_dex_lp_wallet"),
  );
  let nft_lottery = Cell.fromBase64(
    await compileFuncFile(code_path, "nft_lottery"),
  );
  return {
    erc404_collection_code,
    erc404_nft_item_code,
    erc404_jetton_wallet_code,
    erc404_master_code,
    pink_order_sale,
    pink_market,
    trc404_upgrade_v1_to_v2,
    dex_pool_code,
    dex_lp_wallet,
    nft_lottery,
  };
}

export { client };
