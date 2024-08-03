import * as dotenv from "dotenv";
import { Address } from "@ton/core";
import { toFriendlyAddress } from "./com.utils";
// Load the environment variables
dotenv.config();
// Main function to handle the download and upload process

(() => {
  console.info(
    toFriendlyAddress(
      Address.parse("0QAAHhCqsOu88gmvcjLnZwBnRTbHZMIEucSqfFaAJBKhCngN"),
    ),
  );

  console.info(
    toFriendlyAddress("kQAUO3ODqx2hB0wDlHm-4sVKe1VxLn5qUdcul_4AW0DPt9u4"),
  );

  console.info(
    toFriendlyAddress("tUQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8"),
  );

  // console.info(typeof ActionTypes.InvitedPremium === "string");
  //
  // console.info(ActionTypes.InvitedPremium);
  //
  // let sss: string = ActionTypes.GroupAdd;
  //
  // console.info(sss);
  // console.info(calculateAddGroupReward(-1));
  // console.info(calculateAddGroupReward(0));
  // console.info(calculateAddGroupReward(1000));
  // console.info(calculateAddGroupReward(5001));
  // console.info(calculateAddGroupReward(6000));
  // console.info(calculateAddGroupReward(60000));
  // console.info(calculateAddGroupReward(100000));
  // console.info(calculateAddGroupReward(100000000));
})();
