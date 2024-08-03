export enum ActionTypes {
  Register = "Register",
  RegisterPremium = "RegisterPremium",
  GroupAdd = "GroupAdd",
  MemeDeploy = "MemeDeploy",
  MemeBuy = "MemeBuy",
  MemeSell = "MemeSell",
  InvitedUser = "InvitedUser",
  InvitedPremium = "InvitedPremium",
}

export enum OrderStatus {
  Init = "Init",
  PendingSign = "PendingSign",
  Signed = "Signed",
  UserReject = "UserReject",
  Timeout = "Timeout",
  Fail = "Fail",
  Delete = "Delete",
}
