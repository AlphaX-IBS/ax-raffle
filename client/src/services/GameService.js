import { queryAllPlayerTickets } from "./PlayerService";

const reverser = function(i, length) {
  return length - 1 - i;
};

const noop = function(i, length) {
  return i;
};

export async function queryGameConfigs(web3, contract) {
  const weiPerTicket = await contract.weiPerTicket.call();
  const ticketPrice = web3.utils.fromWei(weiPerTicket, "ether");

  const feeRate = await contract.feeRate.call();
  const gameIsActive = await contract.gameIsActive.call();

  return { ticketPrice, feeRate, gameIsActive };
}

export async function queryGlobalParams(web3, contract) {
  const params = await contract.getRaffleParams();
  return {
    ticketPrice: web3.utils.fromWei(params[0], "ether"),
    weiFeeRate: params[1],
    lengthOfGameWinners: params[2].toNumber(),
    potOpenedTimestamp: params[3].toNumber() * 1000,
    potClosedTimestamp: params[4].toNumber() * 1000,
    totalTickets: params[5].toNumber(),
    totalPotPlayers: params[6].toNumber(),
    totalPot: web3.utils.fromWei(params[7], "ether"),
    tokenFeeRate: params[8],
    lengthOfGameTokens: params[9].toNumber(),
    lengthOfPotTokens: params[10].toNumber()
  };
}

export async function queryTotalWinners(contract) {
  const count = await contract.lengthOfGameWinnerList.call();
  return count.toNumber();
}

export async function queryWinners(
  web3,
  contract,
  start = 0,
  limit = 10,
  reverse = false
) {
  const length = await contract.lengthOfGameWinnerList.call();

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
    const winner = await contract.gameWinnerList(index);

    winners.push({
      round: index + 1,
      winnerAddress: winner.winnerAddress,
      totalPot: web3.utils.fromWei(winner.totalWei),
      potEndedTimestamp: winner.potEndedTimestamp.toNumber() * 1000 // seconds to millis
    });
  }
  return {
    list: winners,
    totalWinners: length.toNumber()
  };
}

export async function queryPotRecords(contract, start = 0, limit = 10) {
  const length = await contract.lengthOfpotPlayerTicketList.call();

  const list = [];
  const size = Math.min(limit, length - start);

  for (let i = start; i < size; i++) {
    // const exrecord = { playerAddress, totalTickets };
    const playerRecord = await contract.potPlayerTicketList(i);
    list.push({
      playerAddress: playerRecord.playerAddress,
      ticketStartNumber: playerRecord.ticketStartNumber.toNumber(),
      ticketEndNumber: playerRecord.ticketEndNumber.toNumber(),
      totalTickets: playerRecord.totalTickets.toNumber()
    });
  }

  // console.log(`potRecords=${JSON.stringify(list)}`);

  return list;
}

export async function queryPotRecordsPerPlayer(
  contract,
  start = 0,
  limit = 10
) {
  const length = await contract.lengthOfPotPlayers.call();

  const list = [];
  const size = Math.min(limit, length - start);

  const fetchingTimes = Math.ceil(size / 100);

  let fetchingIndex = start;
  for (let round = 0; round < fetchingTimes; round++) {
    const loadSize = Math.min(100, size - round * 100);
    console.log(`loadSize=${loadSize}`);
    const players = await contract.get100PotPlayers(fetchingIndex, loadSize);

    list.push([...players.slice(0, loadSize)]);
    fetchingIndex = 0;
  }

  console.log(`potRecords=${JSON.stringify(list)}`);

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
  const totalPot = web3.utils.fromWei(totalWeiPot, "ether");

  const totalTicketsBigNumber = await contract.ticketNumberCeiling.call();
  const totalTickets = totalTicketsBigNumber.toNumber();

  const totalPotPlayersBigNumber = await contract.totalPotPlayers.call();
  const totalPotPlayers = totalPotPlayersBigNumber.toNumber();

  return {
    potOpenedTimestamp,
    potClosedTimestamp,
    totalPot,
    totalTickets,
    totalPotPlayers
  };
}
