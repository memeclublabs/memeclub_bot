import { Address, beginCell, Cell, toNano } from "@ton/core";

/**
 * 构建发送给 Master 合约的部署消息（接受到消息后 Master 合约进行部署）
 *
 * ⚠️：如下消息所示，只要合约没有初始化，第一个附带 init 数据的消息就会初始化合约
 * ⚠️：其中的 body 附带的本消息，是用于处理部署后的逻辑，可有可无（）
 *
 *  await wallet_contract.sendTransfer({
 *         seqno,
 *         secretKey,
 *         messages: [
 *             internal({
 *                 to: deployContractAddress,
 *                 value: deployAmount,
 *                 ⚠️init: { code: state_init.code, data: state_init.data },
 *                 bounce: true,
 *                 ⚠️ body: buildDeployMemeMasterMsg(query_id),
 *             }),
 *         ],
 *     });
 *
 * @param query_id
 */
export function buildDeployMemeMasterMsg(query_id: bigint) {
  let op_deploy = 0xbbb9075c;
  return beginCell().storeUint(op_deploy, 32).storeUint(query_id, 64).endCell();
}

/**
 *
 *
 *
 * @param owner_address
 * @param is_include_address
 */
export function buildProvideWalletAddressMsg(
  owner_address: Address,
  is_include_address: number,
) {
  // int query_id = in_msg_body~load_uint(64);
  // slice owner_address = in_msg_body~load_msg_addr();
  // int include_address? = in_msg_body~load_uint(1);
  let op_provide_wallet_address = 0x2c76b973;
  return beginCell()
    .storeUint(op_provide_wallet_address, 32) //op_code
    .storeUint(0, 64) //query_id
    .storeAddress(owner_address) //owner_address
    .storeUint(is_include_address, 1)
    .endCell();
}

export function buildMintFtMsg(
  to_address: Address,
  jettonAmount: number,
  response_address: Address,
) {
  let op_mint = 0x227d62e9;
  return beginCell()
    .storeUint(op_mint, 32) //op_code
    .storeUint(0, 64) //query_id
    .storeAddress(to_address) //to_address  ,use owner/kojh1 address
    .storeCoins(toNano(jettonAmount)) // the jetton_amount you want to mint
    .storeAddress(response_address)
    .endCell();
}

export function buildWithdrawMsg(withdraw_amount: number, to_address: Address) {
  let op_withdraw = 0xcb03bfaf;
  // int withdraw_amount =  in_msg_body~load_coins(); ;; withdraw_amount ,need to less than conntract balance
  // slice to_address =  in_msg_body~load_msg_addr(); ;;to_address
  return beginCell()
    .storeUint(op_withdraw, 32) //op_code
    .storeUint(0, 64) //query_id
    .storeCoins(toNano(withdraw_amount)) //withdraw_amount
    .storeAddress(to_address)
    .endCell();
}

export function buildUpgradeMsg(new_code: Cell) {
  let op_upgrade_code = 0x61bddf8b;
  return beginCell()
    .storeUint(op_upgrade_code, 32) //op_code
    .storeUint(0, 64) //query_id
    .storeRef(new_code)
    .endCell();
}

export function buildChangeMasterAdminMsg(new_admin_address: Address) {
  let op_change_admin = 0xb6801836;
  return beginCell()
    .storeUint(op_change_admin, 32) //op_code
    .storeUint(0, 64) //query_id
    .storeAddress(new_admin_address)
    .endCell();
}

/**
 * 构建购买 Jetton 的消息
 *
 *
 * @param buy_amount
 * @param query_id
 */
export function buildBuyTokenMsg(buy_amount: number, query_id: bigint) {
  let op_buy = 0xaf750d34;
  return beginCell()
    .storeUint(op_buy, 32) //op_code
    .storeUint(query_id, 64) //query_id
    .storeCoins(toNano(buy_amount))
    .endCell();
}
