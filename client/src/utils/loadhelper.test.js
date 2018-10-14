import { load } from "./loadhelper";

test("winner flow first load page 1", async () => {
  const maxWinners = 1;
  const winner1 = {
    round: 0,
    winnerAddress: "0x48b2f0f0b403b29667e7a54775451873d927185a",
    totalPot: 1.001,
    potEndedTimestamp: 1538153048516
  };

  const pageSize = 2;
  const page = 1;

  const winners = {
    list: [],
    totalWinners: maxWinners
  };

  const data = await load(
    { list: winners.list, total: winners.totalWinners },
    { pageSize, page },
    (list, max, start, limit) => {
      expect(start).toBe(0);
      expect(limit).toBe(2);
      return Promise.resolve({
        list: [winner1],
        totalWinners: maxWinners
      });
    },
    (resultList, max) => ({
      list: resultList,
      totalWinners: max
    })
  );

  const expectedPayload = {
    list: [winner1],
    totalWinners: maxWinners
  };
  expect(data).toEqual(expectedPayload);
});

test("winner flow first load page 2", async () => {
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

  const pageSize = 2;
  const page = 2;

  const winners = {
    list: [],
    totalWinners: maxWinners
  };

  const data = await load(
    { list: winners.list, total: winners.totalWinners },
    { pageSize, page },
    (list, max, start, limit) => {
      expect(start).toBe(2);
      expect(limit).toBe(2);
      return Promise.resolve({
        list: [winner3, winner4],
        totalWinners: maxWinners
      });
    },
    (resultList, max) => ({
      list: resultList,
      totalWinners: max
    })
  );

  const expectedPayload = {
    list: [null, null, winner3, winner4],
    totalWinners: maxWinners
  };
  expect(data).toEqual(expectedPayload);
});

// winner flow load page 1 again

test("winner flow third load page 2", async () => {
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

  const pageSize = 2;
  const page = 2;

  const currentWinners = {
    list: [winner1, winner2, null, null, winner5],
    totalWinners: maxWinners
  };

  const data = await load(
    { list: currentWinners.list, total: currentWinners.totalWinners },
    { pageSize, page },
    (list, max, start, limit) => {
      expect(start).toBe(2);
      expect(limit).toBe(2);
      return Promise.resolve({
        list: [winner3, winner4],
        totalWinners: maxWinners
      });
    },
    (resultList, max) => ({
      list: resultList,
      totalWinners: max
    })
  );

  const expectedPayload = {
    list: [winner1, winner2, winner3, winner4, winner5],
    totalWinners: maxWinners
  };
  expect(data).toEqual(expectedPayload);
});

test("winner flow reload page 2", async () => {
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

  const pageSize = 2;
  const page = 2;

  const winners = {
    list: [null, null, winner3],
    totalWinners: maxWinners
  };

  const data = await load(
    { list: winners.list, total: winners.totalWinners },
    { pageSize, page },
    (list, max, start, limit) => {
      expect(start).toBe(2);
      expect(limit).toBe(2);
      return Promise.resolve({
        list: [winner3, winner4],
        totalWinners: maxWinners
      });
    },
    (resultList, max) => ({
      list: resultList,
      totalWinners: max
    }),
    true
  );

  const expectedPayload = {
    list: [null, null, winner3, winner4],
    totalWinners: maxWinners
  };
  expect(data).toEqual(expectedPayload);
});

test("winner flow load more page 2", async () => {
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

  const pageSize = 2;
  const page = 2;

  const winners = {
    list: [null, null, winner3],
    totalWinners: maxWinners
  };

  const data = await load(
    { list: winners.list, total: winners.totalWinners },
    { pageSize, page },
    (list, max, start, limit) => {
      expect(start).toBe(3);
      expect(limit).toBe(1);
      return Promise.resolve({
        list: [winner4],
        totalWinners: maxWinners
      });
    },
    (resultList, max) => ({
      list: resultList,
      totalWinners: max
    })
  );

  const expectedPayload = {
    list: [null, null, winner3, winner4],
    totalWinners: maxWinners
  };
  expect(data).toEqual(expectedPayload);
});
