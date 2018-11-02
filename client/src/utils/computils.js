import { BN } from "bn.js";

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

export function getNetName(networkId) {
  if (networkId == "3") {
    return "ropsten";
  }
  if (networkId == "4") {
    return "rinkeby";
  }

  return "";
}

export function getEtherscan(networkId, address) {
  const netName = getNetName(networkId);
  if (netName.length > 0) {
    return "https://" + netName + ".etherscan.io/address/" + address;
  }

  return "https://etherscan.io/address/" + address;
}

export function shortenAddress(address, startLimit, trailLimit) {
  const lengthLimit = startLimit + trailLimit;
  if (address.length <= lengthLimit) {
    return address;
  }
  return address
    .substr(0, startLimit)
    .concat("...", address.substr(address.length - trailLimit, address.length));
}
