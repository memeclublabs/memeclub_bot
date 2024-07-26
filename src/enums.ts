export enum CoinStatus {
  Init = "Init",
  Deploying = "Deploying",
  Deployed = "Deployed",
  FailedToDeploy = "FailedToDeploy",
  DexListing = "DexListing",
  FailedToListing = "FailedToListing",
  DexListed = "DexListed",
}

function getCoinStatus(status: string): CoinStatus | undefined {
  if (Object.values(CoinStatus).includes(status as CoinStatus)) {
    return status as CoinStatus;
  }
  return undefined; // 或者你可以抛出一个错误
}

// : "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
export enum ChatStatus {
  creator = "creator",
  member = "member",
  administrator = "administrator",
  restricted = "restricted",
  left = "left",
  kicked = "kicked",
}

function getChatStatus(status: string): ChatStatus | undefined {
  if (Object.values(ChatStatus).includes(status as ChatStatus)) {
    return status as ChatStatus;
  }
  return undefined;
}

function isChatStatus(value: string): value is ChatStatus {
  return Object.values(ChatStatus).includes(value as ChatStatus);
}
