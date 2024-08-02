import * as dotenv from "dotenv";
import { ActionTypes } from "./com.enums";
import { calculateAddGroupReward } from "./member/my_chat_member";
// Load the environment variables
dotenv.config();
// Main function to handle the download and upload process

(() => {
  console.info(typeof ActionTypes.InvitedPremium === "string");

  console.info(ActionTypes.InvitedPremium);

  let sss: string = ActionTypes.GroupAdd;

  console.info(sss);
  console.info(calculateAddGroupReward(-1));
  console.info(calculateAddGroupReward(0));
  console.info(calculateAddGroupReward(1000));
  console.info(calculateAddGroupReward(5001));
  console.info(calculateAddGroupReward(6000));
  console.info(calculateAddGroupReward(60000));
  console.info(calculateAddGroupReward(100000));
  console.info(calculateAddGroupReward(100000000));
})();
