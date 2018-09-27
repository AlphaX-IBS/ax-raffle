export function queryTickets(start, limit) {
  return {
    list: [
      {
        address: "0x5aeda56215b167893e80b4fe645ba6d5bab767de",
        sum: 10
      },
      {
        address: "0x6330a553fc93768f612722bb8c2ec78ac90b3bbc",
        sum: 2
      },
      {
        address: "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5",
        sum: 3
      }
    ],
    totalTicketCount: 15,
    total: 3
  };
}

export function queryAllPlayerTickets() {
  return {
    list: [
      {
        startNum: 1,
        endNum: 1,
        timestamp: 1537964215974
      },
      {
        startNum: 2,
        endNum: 3,
        timestamp: 1537964515974
      }
    ],
    totalPlTickets: 3
  };
}

export default {
  queryTickets,
  queryAllPlayerTickets
};
