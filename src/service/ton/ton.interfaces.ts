import { Address, Cell } from "@ton/core";

export interface MemeMasterDeployParam {
  jetton_name: string;
  jetton_description: string;
  jetton_symbol: string;
  image_url: string;
  max_supply: string;
  admin_address: Address;
  jetton_wallet_code: Cell;
  tx_fee_numerator: number;
  curve_type: number;
  param_a: number;
  param_b: number;
  param_c: number;
  meme_master_code: Cell;
}
