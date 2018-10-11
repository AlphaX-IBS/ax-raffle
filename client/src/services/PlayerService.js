import Notif from "../components/Notif";
import BN from "bn.js";

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

export async function transferTokens(web3, cryptoContract, fromAddress, raffleContractAddress, connectType, cryptoCurrency, ticketAmount, gas) {

  const wei =  cryptoCurrency.amountPerTicket.mul(new BN(ticketAmount.toString()));

  alert(`Wei=${Intl.NumberFormat().format(wei)} and gas limit=${Intl.NumberFormat().format(gas)} and gas price = 2000000000 (2Gwei)`);

  let transactionHash = null;

  // Attention, This is a web3 contract, not truffle contract.
  await cryptoContract.methods.approve(raffleContractAddress, wei.toString(10)).send({from: fromAddress}, function (err, txHash) {
    if (err) console.error(err);
   
    if (txHash) {
      console.log('Transaction sent');
      console.dir(txHash);
      transactionHash = txHash;
    }
  });

  return transactionHash;
}

export async function exchangeTokensForTickets(web3, contract, account, cryptoCurrency, ticketAmount, gas) {
  const wei =  cryptoCurrency.amountPerTicket.mul(new BN(ticketAmount.toString()));

  alert(`Wei=${Intl.NumberFormat().format(wei)} and gas limit=${Intl.NumberFormat().format(gas)} and gas price = 2000000000 (2Gwei)`);

  const tokens = [cryptoCurrency.contract];
  const tokenAmounts = [wei];

  await contract.purchaseTicketsByTokens(tokens, tokenAmounts, { from: account});
}

export function buyTickets(web3, contract, account, connectType,  cryptoCurrency, ticketAmount, gas) {
  // const wei = web3.utils.toWei(etherAmount.toFixed(3).toString());

  const wei =  cryptoCurrency.amountPerTicket.mul(new BN(ticketAmount.toString()));

  alert(`Wei=${Intl.NumberFormat().format(wei)} and gas limit=${Intl.NumberFormat().format(gas)} and gas price = 2000000000 (2Gwei)`);
  // await contract.purchaseTicketsByEther({ from: account, value: wei });
  if (connectType === 0 ) {
    // Metamask
    return contract.send(wei, {from: account});
  } else {
    // Private key
    // contract.send() somehow does not work with private key method
    return web3.eth.sendTransaction({
      from: account,
      to: contract.address,
      value: wei,
      gas: gas,
      gasPrice: 2000000000,//2Gwei
    }).on('transactionHash', hash => {
      console.log('transaction sent! hash: ' + hash);
      Notif.info('transaction hash: ' + hash, 5)
    }).on('receipt', receipt => {
      console.log('transaction done!', receipt);
      Notif.success('transaction completed!', 5);
    }).on('error', err => {
      Notif.error(err.message, 5);
      throw err;
    })
  }
}

export default {
  queryAllPlayerTickets,
  buyTickets
};
