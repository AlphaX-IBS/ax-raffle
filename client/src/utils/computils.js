import { BN } from 'bn.js';

export function buildAmountString(usedTokens, tokens) {
  let separator = "";
  let result = "";

  const perWei = new BN("1000000000000000000");

  for (let i = 0; i < usedTokens.length; i++) {
    const usedToken = usedTokens[i];
    const supToken = tokens[usedToken.tokenAddress];
    if (supToken) {
      const tokenSymbol = supToken.symbol;
      const amount = usedToken.tokenAmount.div(perWei);
      result = result.concat(separator, amount, " ", tokenSymbol);
      separator = ", ";
    } else {
      console.warn(`Token ${usedToken.tokenAddress} not found`);
    }
  }
  return result;
}
