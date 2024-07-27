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

export async function getMemeDexBase64() {
  const meme_master =
    "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";
  const meme_wallet =
    "te6cckECEgEAAzQAART/APSkE/S88sgLAQIBYgIRAgLMAwYCAdQEBQDDCDHAJJfBOAB0NMDAXGwlRNfA/AM4PpA+kAx+gAxcdch+gAx+gAwc6m0AALTH4IQD4p+pVIgupUxNFnwCeCCEBeNRRlSILqWMUREA/AK4DWCEFlfB7y6k1nwC+BfBIQP8vCAAET6RDBwuvLhTYAIBIAcQAgEgCAoB8VA9M/+gD6QCHwAe1E0PoA+kD6QNQwUTahUirHBfLiwSjC//LiwlQ0QnBUIBNUFAPIUAT6AljPFgHPFszJIsjLARL0APQAywDJIPkAcHTIywLKB8v/ydAE+kD0BDH6ACDXScIA8uLEd4AYyMsFUAjPFnD6AhfLaxPMgJAK6CEBeNRRnIyx8Zyz9QB/oCIs8WUAbPFiX6AlADzxbJUAXMI5FykXHiUAioE6CCCOThwKoAggiYloCgoBS88uLFBMmAQPsAECPIUAT6AljPFgHPFszJ7VQCASALDwP3O1E0PoA+kD6QNQwCNM/+gBRUaAF+kD6QFNbxwVUc21wVCATVBQDyFAE+gJYzxYBzxbMySLIywES9AD0AMsAyfkAcHTIywLKB8v/ydBQDccFHLHy4sMK+gBRqKGCCJiWgIIImJaAErYIoYII5OHAoBihJ+MPJdcLAcMAI4AwNDgBwUnmgGKGCEHNi0JzIyx9SMMs/WPoCUAfPFlAHzxbJcYAQyMsFJM8WUAb6AhXLahTMyXH7ABAkECMADhBJEDg3XwQAdsIAsI4hghDVMnbbcIAQyMsFUAjPFlAE+gIWy2oSyx8Syz/JcvsAkzVsIeIDyFAE+gJYzxYBzxbMye1UANs7UTQ+gD6QPpA1DAH0z/6APpAMFFRoVJJxwXy4sEnwv/y4sKCCOThwKoAFqAWvPLiw4IQe92X3sjLHxXLP1AD+gIizxYBzxbJcYAYyMsFJM8WcPoCy2rMyYBA+wBAE8hQBPoCWM8WAc8WzMntVIACD1AEGuQ9qJofQB9IH0gahgCaY/BCAvGooypEF1BCD3uy+8J3QlY+XFi6Z+Y/QAYCdAoEeQoAn0BLGeLAOeLZmT2qkABug9gXaiaH0AfSB9IGoYdC8AAk=";
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
