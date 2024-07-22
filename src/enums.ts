enum CoinStatus {
  Initialized = "Initialized",
  Deployed = "Deployed",
}

// : "member" | "creator" | "administrator" | "restricted" | "left" | "kicked"
enum ChatStatus {
  creator = "creator",
  member = "member",
  administrator = "administrator",
  restricted = "restricted",
  left = "left",
  kicked = "kicked",
}

function isChatStatus(value: string): value is ChatStatus {
  return Object.values(ChatStatus).includes(value as ChatStatus);
}
