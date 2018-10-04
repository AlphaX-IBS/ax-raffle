import { put, call, select } from "redux-saga/effects";
import { cloneableGenerator } from "redux-saga/utils";
import { fetchWinners, getWinnersContractState } from "./winners";
import { queryWinners, queryWinnerCount } from "../services/GameService";

describe("winner flow first load page 1", () => {
  const maxWinners = 1;
  const winner1 = {
    round: 0,
    winnerAddress: "0x48b2f0f0b403b29667e7a54775451873d927185a",
    totalPot: 1.001,
    potEndedTimestamp: 1538153048516
  };

  const generator = cloneableGenerator(fetchWinners)({
    type: "WINNERS_FETCH_REQUESTED",
    payload: {
      pageSize: 2,
      page: 1
    }
  });
  expect(generator.next().value).toEqual(select(getWinnersContractState));

  const web3 = {};
  const contract = {};
  const winners = {
    list: [],
    totalWinners: maxWinners
  };

  expect(
    generator.next({
      web3,
      contract,
      winners
    }).value
  ).toEqual(call(queryWinners, web3, contract, 0, 4));

  test("fetch success", () => {
    const clone = generator.clone();

    const response = {
      list: [winner1],
      totalWinners: maxWinners
    };
    const expectedPayload = {
      list: [winner1],
      totalWinners: maxWinners
    };
    expect(clone.next(response).value).toEqual(
      put({ type: "WINNERS_FETCH_SUCCEEDED", payload: expectedPayload })
    );
  });
});

describe("winner flow first load page 2", () => {
  const maxWinners = 5;
  const winner3 = {
    round: 3,
    winnerAddress: "0x3",
    totalPot: 1,
    potEndedTimestamp: 1538155048516
  };
  const winner4 = {
    round: 4,
    winnerAddress: "0x4",
    totalPot: 1,
    potEndedTimestamp: 1538155048516
  };
  const generator = cloneableGenerator(fetchWinners)({
    type: "WINNERS_FETCH_REQUESTED",
    payload: {
      pageSize: 2,
      page: 2
    }
  });
  expect(generator.next().value).toEqual(select(getWinnersContractState));

  const web3 = {};
  const contract = {};
  const winners = {
    list: [],
    totalWinners: maxWinners
  };
  expect(
    generator.next({
      web3,
      contract,
      winners
    }).value
  ).toEqual(call(queryWinners, web3, contract, 2, 4));

  test("fetch success", () => {
    const clone = generator.clone();
    const response = {
      list: [winner3, winner4],
      totalWinners: maxWinners
    };
    const expectedPayload = {
      list: [null, null, winner3, winner4],
      totalWinners: maxWinners
    };
    expect(clone.next(response).value).toEqual(
      put({ type: "WINNERS_FETCH_SUCCEEDED", payload: expectedPayload })
    );
  });
});

// winner flow load page 1 again

describe("winner flow third load page 2", () => {
  const maxWinners = 5;
  const winner1 = {
    round: 1,
    winnerAddress: "0x1",
    totalPot: 1.001,
    potEndedTimestamp: 1538154048516
  };
  const winner2 = {
    round: 2,
    winnerAddress: "0x2",
    totalPot: 190,
    potEndedTimestamp: 1538154048516
  };
  const winner3 = {
    round: 3,
    winnerAddress: "0x3",
    totalPot: 1,
    potEndedTimestamp: 1538155048516
  };
  const winner4 = {
    round: 4,
    winnerAddress: "0x4",
    totalPot: 1,
    potEndedTimestamp: 1538155048516
  };
  const winner5 = {
    round: 5,
    winnerAddress: "0x5",
    totalPot: 190,
    potEndedTimestamp: 1538154048516
  };

  const generator = cloneableGenerator(fetchWinners)({
    type: "WINNERS_FETCH_REQUESTED",
    payload: {
      pageSize: 2,
      page: 2
    }
  });
  expect(generator.next().value).toEqual(select(getWinnersContractState));

  const web3 = {};
  const contract = {};
  const currentWinners = {
    list: [winner1, winner2, null, null, winner5],
    totalWinners: maxWinners
  };

  expect(
    generator.next({
      web3,
      contract,
      winners: currentWinners
    }).value
  ).toEqual(call(queryWinners, web3, contract, 2, 4));

  test("fetch success", () => {
    const clone = generator.clone();
    const response = {
      list: [winner3, winner4],
      totalWinners: maxWinners
    };
    const expectedPayload = {
      list: [winner1, winner2, winner3, winner4, winner5],
      totalWinners: maxWinners
    };
    expect(clone.next(response).value).toEqual(
      put({ type: "WINNERS_FETCH_SUCCEEDED", payload: expectedPayload })
    );
  });
});
