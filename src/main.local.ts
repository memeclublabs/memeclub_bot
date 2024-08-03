import * as dotenv from "dotenv";
// Load the environment variables
dotenv.config();
// Main function to handle the download and upload process

(() => {
  const BASE_NANO_BIGINT: bigint = 1000000000n;
  let a = 77525512860841n;
  const BASE_NANO_NUMBER: number = 1000000000;
  console.info(a);
  console.info(a / BASE_NANO_BIGINT);
  console.info((Number(a) / BASE_NANO_NUMBER).toFixed(2));

  // console.info(
  //   toFriendlyAddress(
  //     Address.parse("0QAAHhCqsOu88gmvcjLnZwBnRTbHZMIEucSqfFaAJBKhCngN"),
  //   ),
  // );
  //
  // console.info(
  //   toFriendlyAddress("kQAUO3ODqx2hB0wDlHm-4sVKe1VxLn5qUdcul_4AW0DPt9u4"),
  // );
  //
  // console.info(
  //   toFriendlyAddress("tUQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8"),
  // );
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
