export async function queryAllPlayerTickets(web3, contract, account) {
  const numberList = await contract.lookUpTicketNumbersByPlayerAddress(account);

  const tickets = {
    list: [],
    totalPlTickets: 0
  };

  if (Array.isArray(numberList) && numberList.length % 2 === 0) {
    for (let i = 0; i < numberList.length; i += 2) {
      const startNum = numberList[i].toNumber();
      const endNum = numberList[i + 1].toNumber();
      if (startNum !== 0 || endNum !== 0) {
        const record = {
          ticketStartNumber: startNum,
          ticketEndNumber: endNum
        };
        tickets.list.push(record);
        tickets.totalPlTickets +=
          record.ticketEndNumber - record.ticketStartNumber + 1;
      }
    }
  }

  // console.log(`playerTickets=${JSON.stringify(tickets)}`);

  return tickets;

  // return {
  //   list: [
  //     {
  //       ticketStartNumber: 1,
  //       ticketEndNumber: 1
  //     },
  //     {
  //       ticketStartNumber: 2,
  //       ticketEndNumber: 3
  //     }
  //   ],
  //   totalPlTickets: 3
  // };
}

export async function buyTickets(web3, contract, account, etherAmount) {
  const wei = web3.utils.toWei(etherAmount.toFixed(3).toString());
  alert(`ether=${etherAmount} and wei=${wei}`);
  // await contract.purchaseTicketsByEther({ from: account, value: wei });
  await contract.send(wei, { from: account });
}

export default {
  queryAllPlayerTickets,
  buyTickets
};