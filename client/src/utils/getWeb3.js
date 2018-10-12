import Web3 from "web3";
import HttpHeaderProvider from "httpheaderprovider";

const headers = {};

export const getWeb3 = loaded =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    const loadWeb3 = () => {
      let web3;
      if (process.env.REACT_APP_MODE === "development") {
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new HttpHeaderProvider(
          "http://localhost:8545",
          headers
        );
        web3 = new Web3(provider);
        console.log(
          "No web3 instance injected, using Local web3 connecting to Ropsten."
        );
        resolve(web3);
      } else {
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        );
        web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        resolve(web3);
      }
    };
    if (loaded) {
      loadWeb3();
    }
    window.addEventListener("load", loadWeb3);
  });

export const getPayableWeb3 = () =>
  new Promise((resolve, reject) => {
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask).
    const alreadyInjected = typeof web3 !== "undefined";

    if (alreadyInjected) {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      console.log("Injected web3 detected.");
      resolve(web3);
    } else {
      reject(new Error("Metamask/Mist not found"));
    }
  });

export const getEstimatedGas = (web3, from, to) => 
  new Promise((resolve) => {
    // console.log('from', from);
    // console.log('to', to);
    // estimate gas always fails? => No, it worked after adding value. See below.
    resolve(web3.eth.estimateGas({
      from: from,
      to: to,
      value: web3.utils.toWei("1", "ether")
    }))
  })

// // This ways fails too :(
// export const getEstimatedGas = (web3, contract, from, to) => {
//   const wei = web3.utils.toWei("1", "ether");
//   return contract.purchaseTicketsByWei.estimateGas({ from: from, to: to, value: wei, gas: 90000 }).then(function(result) {
//     console.log(`gasresult=${JSON.stringify(result)}`);
//     return result;
//   }, function(reason) {
//     console.error(reason);
//     return reason;
//   });
// }

export default { getWeb3, getPayableWeb3, getEstimatedGas };
