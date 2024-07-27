import { Address, beginCell, Cell, contractAddress, toNano } from "@ton/core";
import { MemeMasterDeployParam } from "./ton.interfaces";
import { buildOnchainMetadata } from "./util.helpers";

/**
 * 构建 Meme Jetton 钱包地址和 Init 信息
 *
 * @param user_client_wallet
 * @param jetton_master_address
 * @param jetton_wallet_code
 */
export async function getMemeWalletAddressAndInit(
  user_client_wallet: Address,
  jetton_master_address: Address,
  jetton_wallet_code: Cell,
) {
  // .store_coins(balance)
  // .store_slice(owner_address)
  // .store_slice(jetton_master_address)
  // .store_ref(jetton_wallet_code)
  let wallet_init_data = beginCell()
    .storeCoins(0) //;; jetton_balance ,
    .storeAddress(user_client_wallet) // ;; owner_address
    .storeAddress(jetton_master_address) //;; Jetton_master_address
    .storeRef(jetton_wallet_code) //;; Jetton_wallet_code
    .endCell();

  let state_init = { code: jetton_wallet_code, data: wallet_init_data };
  let address = contractAddress(0, state_init);
  return { address, state_init };
}

/**
 * 构建 Meme Master 地址和 Init 信息
 *
 * @param memeMasterDeployParam
 */
// jetton_name:string,jetton_description:string,jetton_symbol:string,image_url:string,
//                     max_supply:string,admin_address: Address,jetton_wallet_code:Cell,tx_fee_numerator:number,curve_type:number,
//                     param_a:number,param_b:number,param_c:number,meme_master_code:Cell
export async function getMemeMasterAddressAndInit(
  memeMasterDeployParam: MemeMasterDeployParam,
) {
  //********1. init Meme master contract address*/

  // let seed = Math.floor(Math.random() * 100001); //in order to make different contract
  // let time = new Date().getTime(); //in order to make different contract
  // let nonce = seed.toString() + time.toString()

  //v3 testnet
  // nonce: 340341718385655003 seed: 34034
  let nonce = "947301720798821555";
  let seed = 94730;

  console.log("******* v3 *compile contract nonce:", nonce, "seed:", seed);

  const jettonParams = {
    //name: "Test"+seed+jetton_name,
    name: memeMasterDeployParam.jetton_name,
    description: memeMasterDeployParam.jetton_description,
    symbol: memeMasterDeployParam.jetton_symbol,
    decimals: "9",
    image: memeMasterDeployParam.image_url,
    nonce: nonce,
    // image_data: null,
    // uri: null,
    // amount_style: null,
    // render_type: null,
  };
  // Create content Cell
  let content = buildOnchainMetadata(jettonParams);

  // ds~load_coins(), ;; total_supply ,这个是最大供应量，是一个固定值
  // ds~load_msg_addr(), ;; admin_address ,platform_admin_wallet, not user address
  // ds~load_ref(), ;; content
  // ds~load_ref(), ;; jetton_wallet_code

  // ds~load_coins(), ;; current_supply
  // ds~load_coins(), ;; reserve_balance  ;; TON amount ,reserve_balance 不应允许被轻易提取
  // ds~load_coins(), ;; tx_fee_balance  ;; 用户每次sell token都会收一定的tx_fee, 合约的余额应 >= tx_fee_balance + reserve_balance，这部分的余额，管理员可以随时提取
  // ds~load_uint(16),    ;; tx_fee_numerator  tx_fee = sell_price * tx_fee_numerator / 10000
  // ds~load_uint(4),     ;;curve_type 曲线类型， 1: 线性， 2：幂函数 3:sigmoid函数 4:pump.fun S函数  5:友好型S函数（因为func计算能力限制，目前只支持1:线性函数 和 5: 友好型S函数）
  // ds~load_coins(),   ;;param a , 需要使用coins表示小数
  // ds~load_coins(),   ;;param b
  // ds~load_coins(),    ;;param c
  // ds~load_int(2), ;; trade flag, -1:true,0:false,-1时可以正常买和卖token
  // ds~load_int(2) ;; mintable, -1:true,0:false

  let init_data = beginCell()
    .storeCoins(toNano(memeMasterDeployParam.max_supply)) //;; max_supply
    .storeAddress(memeMasterDeployParam.admin_address) //;; admin_address
    .storeRef(content) // ;; content
    .storeRef(memeMasterDeployParam.jetton_wallet_code) //;; jetton_wallet_code

    .storeCoins(0) //;; current_supply
    .storeCoins(0) //;; reserve_balance
    .storeCoins(0) //;; tx_fee_balance
    .storeUint(memeMasterDeployParam.tx_fee_numerator, 16) // tx_fee_numerator
    .storeUint(memeMasterDeployParam.curve_type, 4) //curve_type
    .storeCoins(memeMasterDeployParam.param_a) //;; param_a
    .storeCoins(memeMasterDeployParam.param_b) //;; param_b
    .storeCoins(memeMasterDeployParam.param_c) //;; param_c
    .storeInt(-1, 2) //trade flag, -1:true,0:false,-1时可以正常买和卖token
    .storeInt(-1, 2) //;; mintable -1: true, 0 :false
    .endCell();

  let master_init = {
    code: memeMasterDeployParam.meme_master_code,
    data: init_data,
  };

  let deployMasterContractAddress = contractAddress(0, master_init);

  return { deployMasterContractAddress, master_init };
}
