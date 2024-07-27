import { Address, beginCell, contractAddress, toNano, internal, fromNano, Cell, OpenedContract, Dictionary, Slice } from "@ton/core";

export let op_transfer_ft = 0xf8a7ea5;
export function buildTransferFtMsg(jettonAmount:number,receiver_address:Address,response_address:Address){
  
    return  beginCell().storeUint(op_transfer_ft, 32)  //op_code
        .storeUint(0, 64)  //query_id
        .storeCoins(toNano(jettonAmount)) // the jetton_amount you want to transfer
        .storeAddress(receiver_address)  //to_address  ,the receiver's client wallet address
        .storeAddress(response_address)    //response_destination
        .storeBit(false)    //no custome payload
        //.storeBit(true)    //no custome payload
        .storeCoins(toNano(0.001))    //forward amount 
        .storeBit(2)   //no foward payload
        .endCell();
}


export function buildTransferFtMsgWithForwardPayload(jettonAmount:number,receiver_address:Address,response_address:Address,forward_amount:number,foward_payload:Slice){
    return  beginCell().storeUint(op_transfer_ft, 32)  //op_code
        .storeUint(0, 64)  //query_id
        .storeCoins(toNano(jettonAmount)) // the jetton_amount you want to transfer
        .storeAddress(receiver_address)  //to_address  ,the receiver's client wallet address
        .storeAddress(response_address)    //response_destination
        .storeBit(false)    //no custome payload
        //.storeBit(true)    //no custome payload
        .storeCoins(toNano(forward_amount))    //forward amount 
        .storeSlice(foward_payload)   //foward payload
        .endCell();
}


export function buildTransferFtMsgWithCommentForwardPayload(jettonAmount:number,receiver_address:Address,response_address:Address,forward_amount:number,forward_payload:Cell){
//     const encoder = new TextEncoder();
//    const utf8Buffer = encoder.encode(comment);    
   
    return  beginCell().storeUint(op_transfer_ft, 32)  //op_code
        .storeUint(0, 64)  //query_id
        .storeCoins(toNano(jettonAmount)) // the jetton_amount you want to transfer
        .storeAddress(receiver_address)  //to_address  ,the receiver's client wallet address
        .storeAddress(response_address)    //response_destination
        .storeBit(false)    //no custome payload
        //.storeBit(true)    //no custome payload
        .storeCoins(toNano(forward_amount))    //forward amount 
        .storeBit(1) // we store forwardPayload as a reference
        .storeRef(forward_payload)
        .endCell();
}


export function buildBurnTokenMsg(burnAmount:number,response_address:Address,query_id:bigint){
   let op_burn_token=0x595f07bc;
    return  beginCell().storeUint(op_burn_token, 32)  //op_code
        .storeUint(query_id, 64)  //query_id
        .storeCoins(toNano(burnAmount)) // the jetton_amount you want to burn
        .storeAddress(response_address)    //response_destination
        .storeBit(false)    //no custome payload
        .endCell();
}




