// 自定义 replacer 函数，将 BigInt 转换为字符串
export function bigintReplacer(key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}
