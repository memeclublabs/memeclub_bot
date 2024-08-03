import TonConnect from "@tonconnect/sdk";
import { TonClient, TupleItem } from "@ton/ton";
import { isMainnet, tonTestOnly } from "../../com.utils";
import { Address, beginCell } from "@ton/core";

export async function getJettonWalletInfo(
  connector: TonConnect,
  masterAddress: string,
): Promise<{
  success: boolean;
  msg?: string;
  nanoBalance?: bigint;
  jettonWalletAddress?: string;
}> {
  let result: {
    success: boolean;
    msg?: string;
    nanoBalance?: bigint;
    jettonWalletAddress?: string;
  } = {
    success: false,
  };

  try {
    const client = new TonClient({
      // endpoint: isMainnet() ? ENDPOINT_MAINNET_RPC : ENDPOINT_TESTNET_RPC,
      endpoint: isMainnet()
        ? "https://toncenter.com/api/v2/jsonRPC"
        : "https://testnet.toncenter.com/api/v2/jsonRPC",
      apiKey:
        "aa74010f1ee273a1dcdfa6827f5b8265f9ea816876e52f90b4eec31ef40020af",
      timeout: 60000, // 60s 超时
    });

    // ------------
    let userWalletAddressStr = connector.account?.address;
    if (!userWalletAddressStr) {
      result.msg = "Can not found any user wallet address";
      return result;
    }

    let jettonWalletAddress = await getJettonAddress(
      masterAddress,
      userWalletAddressStr!,
      client,
    );
    // ------------

    const jetton_wallet_tx = await client.runMethod(
      jettonWalletAddress,
      "get_wallet_data",
    );
    let jetton_wallet_result = jetton_wallet_tx.stack;
    let jettonBalanceNanoBigint = jetton_wallet_result.readBigNumber();
    result.success = true;
    result.nanoBalance = jettonBalanceNanoBigint;
    result.jettonWalletAddress = jettonWalletAddress.toString({
      bounceable: true,
      testOnly: tonTestOnly(),
    });

    console.info("============ getJettonWalletInfo =================");
    console.info(jettonBalanceNanoBigint);
    console.info(result);
    console.info("=============================");

    return result;
  } catch (e) {
    console.error(e);
    let oneMsg = "Fail to get user's memecoin balance.";
    if (e instanceof Error) {
      oneMsg = e.message;
    }
    result.msg = oneMsg;
    return result;
  }
}

async function getJettonAddress(
  masterAddress: string,
  walletAddress: string,
  client: TonClient,
): Promise<Address> {
  console.info("masterAddress", masterAddress);
  console.info("walletAddress", walletAddress);
  let ownerAddressCell = beginCell()
    .storeAddress(Address.parse(walletAddress))
    .endCell();
  let stack: TupleItem[] = [];
  stack.push({ type: "slice", cell: ownerAddressCell });
  const queryResult = await client.runMethod(
    Address.parse(masterAddress),
    "get_wallet_address",
    stack,
  );
  let jetton_master_result = queryResult.stack;
  return jetton_master_result.readAddress();
}
