// Function to convert big integer to alphabetic string

import { Invite_ } from "./com.static";

export function generateReferralCode(tgId: number): string {
  // Convert the string to a BigInt
  const bigIntValue = BigInt(tgId);
  // Convert the BigInt to an uppercase hexadecimal string
  let hexString = bigIntValue.toString(16).toUpperCase();
  // If the number is negative, ensure the correct sign
  let isNegative = false;
  if (bigIntValue < 0) {
    isNegative = true;
    hexString = hexString.slice(1); // Remove the negative sign
  }
  // Convert each hex digit to its corresponding letter
  const alphabeticString =
    Invite_ + hexString.split("").map(hexDigitToLetter).join("");
  return isNegative ? "_" + alphabeticString : alphabeticString;
}

// Function to map hex digits to letters
function hexDigitToLetter(hexDigit: string): string {
  const letterMap: { [key: string]: string } = {
    "0": "Q",
    "1": "R",
    "2": "S",
    "3": "T",
    "4": "U",
    "5": "V",
    "6": "W",
    "7": "X",
    "8": "Y",
    "9": "Z",
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
  };
  return letterMap[hexDigit.toUpperCase()];
}
