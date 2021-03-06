import { negativePowerOfTen } from "./../utils/numeric";
import { BigNumber } from "bignumber.js";

const reverser = function(i, length) {
  return length - 1 - i;
};

const noop = function(i, length) {
  return i;
};

export async function querySupportedTokens(web3, contract) {
  const length = await contract.lengthOfGameTokens.call();

  const weiPerTicket = await contract.weiPerTicket.call();
  const ethAmountAsStr = negativePowerOfTen(weiPerTicket.toString(), 18);

  const tokens = {
    "0x0": {
      contract: "0x0",
      symbol: "ETH",
      decimals: 18,
      amountPerTicket: weiPerTicket,
      displayValue: new BigNumber(ethAmountAsStr),
      active: true
    }
  };
  for (let i = 0; i < length; i++) {
    const tokenInfo = await contract.gameTokens(i);
    // console.log(`tokens=${JSON.stringify(tokenInfo)}`);
    const address = tokenInfo.contract_;
    const active = await contract.gameTokenStatuses(address);

    const amountInWeiAsStr = tokenInfo.amountPerTicket_.toString();
    const power = tokenInfo.decimals_.toNumber();
    const amountAsStr = negativePowerOfTen(amountInWeiAsStr, power);
    tokens[address] = {
      contract: address,
      symbol: web3.utils.toAscii(tokenInfo.symbol_).replace(/\u0000/g, ""),
      decimals: tokenInfo.decimals_.toNumber(),
      amountPerTicket: tokenInfo.amountPerTicket_,
      displayValue: new BigNumber(amountAsStr),
      active
    };
  }

  return tokens;
}

export async function queryGameConfigs(web3, contract) {
  const weiPerTicket = await contract.weiPerTicket.call();
  const ticketPrice = web3.utils.fromWei(weiPerTicket, "ether");

  const feeRate = await contract.feeRate.call();
  const gameIsActive = await contract.gameIsActive.call();

  return { ticketPrice, feeRate, gameIsActive };
}

export async function queryGlobalParams(web3, contract) {
  const params = await contract.getRaffleParams();
  const potOpeningPeriod = await contract.potOpeningPeriod.call();

  return {
    ticketPrice: web3.utils.fromWei(params[0], "ether"),
    weiFeeRate: params[1],
    lengthOfGameWinners: params[2].toNumber(),
    potOpenedTimestamp: params[3].toNumber() * 1000,
    potClosedTimestamp: params[4].toNumber() * 1000,
    totalTickets: params[5].toNumber(),
    totalPotPlayers: params[6].toNumber(),
    totalEthPot: web3.utils.fromWei(params[7], "ether"),
    tokenFeeRate: params[8],
    lengthOfGameTokens: params[9].toNumber(),
    lengthOfPotTokens: params[10].toNumber(),
    potOpeningPeriod: potOpeningPeriod.toNumber()
  };
}

export async function queryTotalWinners(contract) {
  const count = await contract.lengthOfGameWinners.call();
  return count.toNumber();
}

export async function queryWinners(
  web3,
  contract,
  start = 0,
  limit = 10,
  reverse = false
) {
  const length = await contract.lengthOfGameWinners.call();

  const winners = [];
  // winners.push({
  //   round: 0,
  //   winnerAddress: "0x48b2f0f0b403b29667e7a54775451873d927185a",
  //   totalPot: 1.001,
  //   potEndedTimestamp: 1538153048516
  // });
  const size = Math.min(limit, length - start);

  const indexTranslator = reverse ? reverser : noop;

  for (let i = 0; i < size; i++) {
    const index = indexTranslator(i, size);
    const winner = await contract.gameWinners(index);

    // Web3 does not support array in struct.

    const potTokenAddresses = trimArray(
      await contract.getUsedTokensByWinnerAddressAndIndex(winner.player_, i),
      "0x0000000000000000000000000000000000000000"
    );
    const potTokenAmounts = await trimArray(
      await contract.getUsedTokenAmtsByWinnerAddressAndIndex(winner.player_, i),
      "0"
    );

    const minLength = Math.min(
      potTokenAddresses.length,
      potTokenAmounts.length
    );
    const potTokenPrize = [
      {
        tokenAddress: "0x0",
        tokenAmount: new BigNumber(winner.potPrizeWeiAmt_.toString())
      }
    ];

    for (let i = 0; i < minLength; i++) {
      potTokenPrize.push({
        tokenAddress: potTokenAddresses[i],
        tokenAmount: potTokenAmounts[i]
      });
    }

    winners.push({
      round: index + 1,
      winnerAddress: winner.player_,
      potEndedTimestamp: winner.potEndedTimeStamp_.toNumber() * 1000, // seconds to millis
      potTokenPrize
    });
  }
  return {
    list: winners,
    totalWinners: length.toNumber()
  };
}

function trimArray(arr = [], omitString = "") {
  const result = [];
  for (let k in arr) {
    const elem = arr[k];
    if (elem.toString() !== omitString) {
      result.push(elem);
    } else {
      break;
    }
  }
  return result;
}

export async function getPlayerUsedTokens(
  contract,
  playerAddress,
  totalUsedWeiAmt
) {
  const usedTokenAddresses = trimArray(
    await contract.getPotPlayerUsedTokensByAddress(playerAddress),
    "0x0000000000000000000000000000000000000000"
  );
  const usedTokenAmts = trimArray(
    await contract.getPotPlayerUsedTokenAmtsByAddress(playerAddress),
    "0"
  );
  const minLength = Math.min(usedTokenAddresses.length, usedTokenAmts.length);
  const usedTokens = [
    {
      tokenAddress: "0x0",
      tokenAmount: new BigNumber(totalUsedWeiAmt.toString())
    }
  ];

  for (let i = 0; i < minLength; i++) {
    usedTokens.push({
      tokenAddress: usedTokenAddresses[i],
      tokenAmount: usedTokenAmts[i]
    });
  }

  return usedTokens;
}

export async function queryPotPlayer(contract, account) {
  const response = await contract.getPotPlayerTotalOwnedTicketsAndUsedWeiByAddress(
    account
  );

  const totalOwnedTickets = response[0];
  const totalUsedWeiAmt = response[1];

  const usedTokens = await getPlayerUsedTokens(
    contract,
    account,
    totalUsedWeiAmt
  );

  const record = {
    totalTickets: totalOwnedTickets.toNumber(),
    totalUsedWeiAmt: new BigNumber(totalUsedWeiAmt.toString()),
    usedTokens
  };
  return record;
}

export async function queryPotRecordsPerPlayer(
  contract,
  start = 0,
  limit = 10
) {
  const length = await contract.lengthOfPotPlayers.call();

  const list = [];
  const size = Math.min(limit, length - start);

  for (let i = start; i < size; i++) {
    const player = await contract.potPlayers(i);

    const usedTokens = await getPlayerUsedTokens(
      contract,
      player.player_,
      player.totalUsedWeiAmt_
    );

    const record = {
      playerAddress: player.player_,
      totalTickets: player.totalOwnedTickets_.toNumber(),
      totalUsedWeiAmt: new BigNumber(player.totalUsedWeiAmt_.toString()),
      usedTokens
    };
    list.push(record);
    // console.log(`Record=${JSON.stringify(record)}`);
  }

  // console.log(`potRecords=${JSON.stringify(list)}`);

  return {
    list,
    totalPotPlayers: length
  };
}

export async function queryPot(web3, contract) {
  const potOpenedTimestampBigNumber = await contract.potOpenedTimestamp.call();
  const potOpenedTimestamp = potOpenedTimestampBigNumber.toNumber() * 1000; // seconds to millis

  const potClosedTimestampBigNumber = await contract.potClosedTimestamp.call();
  const potClosedTimestamp = potClosedTimestampBigNumber.toNumber() * 1000; // seconds to millis

  const totalWeiPot = await contract.totalWeiPot.call();
  const totalEthPot = web3.utils.fromWei(totalWeiPot, "ether");

  const totalTicketsBigNumber = await contract.ticketNumberCeiling.call();
  const totalTickets = totalTicketsBigNumber.toNumber();

  const totalPotPlayersBigNumber = await contract.totalPotPlayers.call();
  const totalPotPlayers = totalPotPlayersBigNumber.toNumber();

  return {
    potOpenedTimestamp,
    potClosedTimestamp,
    totalEthPot,
    totalTickets,
    totalPotPlayers
  };
}

// Get total amount of tokens used in pot
export async function queryPotTokenAmounts(web3, contract) {
  const length = await contract.lengthOfPotTokens.call();
  const potTokenAmts = [];
  for (let i = 0; i < length; i++) {
    const tokenAddress = await contract.potTokens(i);
    const tokenAmt = await contract.potTokenAmts(i);
    potTokenAmts.push({
      tokenAddress,
      tokenAmt
    });
  }
  return {
    list: potTokenAmts,
    totalPotTokens: length.toNumber()
  };
}

export function calculatePotPrize(
  supportedTokens,
  potTokens,
  ticketPrice,
  totalEthPot
) {
  let totalPot = new BigNumber(totalEthPot);

  const length = potTokens.totalPotTokens;

  const ethAmtDisplayValue = new BigNumber(totalEthPot);
  const data = [
    {
      tokenAddress: "0x0",
      tokenSymbol: "ETH",
      tokenAmtDisplayValue: ethAmtDisplayValue,
      tokenAmtToETH: ethAmtDisplayValue
    }
  ];

  for (let i = 0; i < length; i++) {
    const tokenAddress = potTokens.list[i].tokenAddress;
    const tokenAmount = potTokens.list[i].tokenAmt;
    const tokenSymbol = supportedTokens[tokenAddress].symbol;
    const power = supportedTokens[tokenAddress].decimals;
    const tokenAmtDisplayValue = new BigNumber(
      negativePowerOfTen(tokenAmount.toString(), power)
    );
    const tokenDisplayAmtPerTicket = supportedTokens[tokenAddress].displayValue;
    const tokenAmtToETH = tokenAmtDisplayValue
      .multipliedBy(new BigNumber(ticketPrice))
      .dividedBy(tokenDisplayAmtPerTicket);
    totalPot = totalPot.plus(tokenAmtToETH);

    data.push({
      tokenAddress,
      tokenSymbol,
      tokenAmtDisplayValue,
      tokenAmtToETH
    });
  }

  return {
    potTokens: data,
    totalPot: totalPot
  };
}
