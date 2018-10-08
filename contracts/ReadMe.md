# Ax Raffle Contracts
This folder contains solidity contracts for Raffle dapp, which will be developed on truffle framework.
Here're some steps to deploy, execute and test raffle contract by yourself.

<h1>1- Conctract owner deploy raffle contract to blockchain network</h1>
  Use truffle or remix to deploy raffle contract to local blockchain (ganachecli) or ropsten testnet</br>
  <b>- Input parameter :</b></br>
    + address _operatorAddress : public wallet address of operator, ex "0xB02568edBb99bc70063d47830F9c009Ad5D7d0AE"</br>
    + uint _potSellingPeriod : pot selling period in seconds, ex 28800</br>
    + uint _potOpeningPeriod : next pot opening period in seconds, ex 86400</br> 
    + uint _weiPerTicket : price of ticket by wei, ex 1000000000000000</br>
    + uint _weiFeeRate : fee rate for wei payment, ex 10</br>
    + uint _tokenFeeRate : fee rate for tokens payment, ex 10</br>
    
<h1>2- Raffle workflow will be execute by contract owner (as operator) and players</h1>
  <h2>2.1 Contract owner changes operator wallet address (optional)</h2>
  - Actor: owner</br>
  - Function: setOperatorWalletAddress</br>
  - Input:</br>
  + address _operatorAddress : ex "0xB02568edBb99bc70063d47830F9c009Ad5D7d0AE"
  <h2>2.2 Contract owner changes ticket sales information (optional)</h2>
  - Actor: owner</br>
  - Function: setTicketSales</br>
  - Input:</br>
  + uint _weiPerTicket : ex 1000000000000000</br>
  + uint _weiFeeRate : ex 10</br>
  + uint _tokenFeeRate : ex 10</br>
  <h2>2.3 Contract owner activates / deactivates token payment option (required)</h2>
  - Actor: owner</br>
  - Function: setTokenPaymentStatus</br>
  - Input:</br>
  + bool _isActiveTokenPayment : ex true => active, false => deactive
  <h2>2.4 Contract owner adds / removes token payment information (required)</h2>
  - Actor: owner</br>
  <h3>2.4.1 Function: addNewTokenPaymentInfo</h3>
  - Input:</br>
  + address[] _tokens : ex 0x726D8208f308dEE34Ab34f3eB86672A6CC742987,0x726D8208f308dEE34Ab34f3eB86672A6CC742981</br>
  + bytes32[] _tokenSymbols : ex GEX,BNB</br>
  + uint[] _tokenDecimals : 18,18</br>
  + uint[] _amountPerTicket : 6000000000000000000,5000000000000000000</br>
  <h3>2.4.2 Function: removeTokenPaymentInfo</h3>
  - Input:</br>
  + address[] _tokens : ex 0x726D8208f308dEE34Ab34f3eB86672A6CC742987,0x726D8208f308dEE34Ab34f3eB86672A6CC742981</br>
  <h2>2.5 Contract owner activates / deactivates raffle game (required)</h2>
  - Actor: owner</br>
  - Function: activateGame / deactivateGame</br>
  - Input: N/A</br>
  <h2>2.6 Contract owner opens pot (required)</h2>
  - Actor: owner</br>
  - Function: openPot</br>
  - Input: </br>
  + uint _potOpenedTimestamp : ex 1538626714</br>
  + uint _potSellingPeriod : 28800</br>
  + uint _potOpeningPeriod : 86400</br>
  - <b>Notes:</b></br>
  + Input _potSellingPeriod / _potOpeningPeriod = 0 if don't want to change their current values</br>
  + Input _potOpenedTimestamp = 0 to open pot at the current time
  <h2>2.7 Contract owner closes pot (optional)</h2>
  - Actor: owner</br>
  - Function: closePot</br>
  - Input: </br>
  + uint _potClosedTimestamp : ex 1538626714</br>
  - <b>Notes:</b></br>
  + Input _potClosedTimestamp = 0 to close pot at the current time
  <h2>2.8 Players buy tickets by ether (required)</h2>
  - Actor: players</br>
  - Pre-conditions: game is active and pot is opened.
  - Send ether directly from personal wallet to contract address
  <h2>2.9 Players buy tickets by accepted tokens (required)</h2>
  - Actor: players</br>
  - Pre-conditions: game is active, pot is opened, player approved the relevant allowance for raffle contract before, payment token method is active and token is supported</br>
  - Players call function <b>approve</b> of the relevant token contract to give the relevant allowance for raffle contract address</br>
  - Players call function <b>purchaseTicketsByTokens</b> of raffle contract with relevant token address and token amount to buy tickets</br>
  - <b>Notes:</b></br>
  + We must input token amount in the smallest unit based on its decimals, for example, GEX has 18 decimals, so gex token amount must multiply with 10^18 as input of function
  <h2>2.10 Contract owner draw ticket after closing game (required)</h2>
  - Actor: owner</br>
  - Function: drawTicket</br>
  - Input: N/A</br>
