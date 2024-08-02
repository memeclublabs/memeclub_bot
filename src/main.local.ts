import * as dotenv from "dotenv";
import { ActionTypes } from "./com.enums";
// Load the environment variables
dotenv.config();
// Main function to handle the download and upload process

(() => {
  console.info(typeof ActionTypes.InvitedPremium === "string");

  console.info(ActionTypes.InvitedPremium);

  let sss: string = ActionTypes.GroupAdd;

  console.info(sss);
})();
