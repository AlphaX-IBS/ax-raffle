pragma solidity ^0.4.24;

import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract AxRaffle is Ownable, Pausable {
    using SafeMath for uint;

    // Structures
    // Pot Winner Info
    struct AxPotWinner {
        address winnerAddress;
        uint totalWei;
        AxTokenAmount[] totalTokenAmount;
        uint potEndedTimestamp;
    }

    // Pot Player Info
    // Only store start and end ticket number to save space
    struct AxPotPlayerTicket {
        address playerAddress;
        uint totalTickets;
        uint totalWei;
        AxTokenAmount[] totalTokenAmount;      
        uint ticketStartNumber; 
        uint ticketEndNumber;
    }

    // Token info
    struct AxTokenInfo {
        address contract_;
        byte32 symbol_;
        uint decimals_;
        uint amountPerTicket_;
    }

    // Token amount
    struct AxTokenAmount {
        address contract_;
        uint totalAmount_;
    }
    
    // Variables
    address public operatorAddress; // Operator wallet address

    // uint public minPotPlayers; // minimum number of players required
    uint public weiPerTicket; // Single sale price for ticket in wei
    uint public feeRate; // fee rate (extracted from total prize) for game operator, input 10 <=> 10%
    bool public gameIsActive; // Active flag for Raffle game

    AxPotWinner[] public gameWinnerList; // List of winners in game
    uint public lengthOfGameWinnerList; // Length of game winner list

    uint public potSellingPeriod; // Pot selling period (hs) for calculating pot closed timestamp
    uint public potOpeningPeriod; // Pot opening period (hs) for calculating next open timestamp

    uint public potOpenedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potClosedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potEndedTimestamp; // Pot ended timestamp, unix timestamp UTC
    
    uint public ticketNumberCeiling; // current latest of ticket number
    AxPotPlayerTicket[] public potPlayerTicketList; //list of player-ticket
    uint public lengthOfpotPlayerTicketList; // Length of pot player-ticket list
    AxPotPlayerTicket[] public potPlayerList; // List of pot players
    mapping(address => uint) public potPlayerIndexes; // index of player in pot player list
    uint public totalPotPlayers; // Total players in pot

    uint public totalWeiPot; // Total Ether in pot

    // For token payment
    bool public isActiveTokenPayment; // status of token payment method
    uint public tokenFeeRate; // fee for using token payment
    mapping(address => AxTokenInfo) public tokenPaymentList; // List of supported tokens
    mapping(address => uint) public tokenIndexes; // List of token indexes
    AxTokenAmount[] public potTokenAmountList; // List of token amount in pot
    uint public totalPaymentTokens; // Total number of payment tokens supported
    uint public totalPotTokens; // Total number of tokens used in pot
    ERC20  public ERC20Interface; // ERC20 token interface

    // Events
    event ActivateGame(bool _active);
    event DeactivateGame(bool _deactive);
    event PurchaseTicketsByEther(address indexed playerAddress, uint weiAmount, uint startTicketNumber, uint endTicketNumber);
    event DrawTicket(address indexed winnerAddress, uint winnerTicketNumber, uint winnerPrize, uint potEndedTimestamp);
    event TokenTransferFailed(address indexed from_, address indexed to_, uint tokenAmount_);
    event TokenTransferSuccessful(address indexed from_, address indexed to_, uint tokenAmount_);

    // Modifiers
    modifier activatedGame() {
        require(gameIsActive == true, "game is not activated");
        _;
    }

    modifier potIsActive() {
        require(now >= potOpenedTimestamp && now <= potClosedTimestamp, "game is not active");
        _;
    }

    modifier potIsClosed() {
        require(now > potClosedTimestamp, "pot is not closed");
        _;
    }

    modifier activatedTokenPayment() {
        require(isActiveTokenPayment == true, "Token payment is not active");
        _;
    }    

    // Constructor function
    constructor(
        address _operatorAddress, 
        uint _pot1stOpenedTimestamp,
        uint _potSellingPeriod, 
        uint _potOpeningPeriod, 
        uint _weiPerTicket, 
        uint _feeRate
    ) public {
        require (_operatorAddress != address(0), "operator address is 0");
        operatorAddress = _operatorAddress;
        potOpenedTimestamp = _pot1stOpenedTimestamp;
        potSellingPeriod = _potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        weiPerTicket = _weiPerTicket;
        feeRate = _feeRate;
        lengthOfGameWinnerList = 0;
        lengthOfpotPlayerTicketList = 0;
        totalPotPlayers = 0;
        isActiveTokenPayment = false;
        totalPaymentTokens = 0;
        totalPotTokens = 0;
    }

    // Set operator wallet address
    function setOperatorWalletAddress (address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0), "new operator address is 0");
        require(_operatorAddress != operatorAddress, "new and old address are the same");
        operatorAddress = _operatorAddress;
    }

    // Set pot auto flg, pot opened time stamp, pot selling period, pot opening period
    function setPotOpenParams(uint _potOpenedTimestamp, uint _potSellingPeriod, uint _potOpeningPeriod) external onlyOwner {
        potOpenedTimestamp = _potOpenedTimestamp;
        potSellingPeriod = _potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;
    }

    // Set ticket Ether sale price, fee Ether rate, token fee rate
    function setPotSaleParams(uint _weiPerTicket, uint _feeRate, uint _tokenFeeRate) external onlyOwner {
        weiPerTicket = _weiPerTicket;
        feeRate = _feeRate;
        tokenFeeRate = _tokenFeeRate;
    }

    // Activate game
    function activateGame() external onlyOwner {
        gameIsActive = true;
        emit ActivateGame(true);
    }

    // Deactive game
    function deactivateGame() external onlyOwner {
        gameIsActive = false;
        emit DeactivateGame(false);
    }

    // Activate / Deactive token payment method
    function setTokenPaymentStatus(bool _isActiveTokenPayment) external onlyOwner {
        isActiveTokenPayment = _isActiveTokenPayment;
    }

    // Add new token payment list
    function addNewTokenPaymentInfo(address[] _tokenAddresses, byte32[] _tokenSymbols, uint[] _tokenDecimals, uint[] _tokensPerTicket) external activatedTokenPayment potIsClosed onlyOwner {
        require(_tokenAddresses.length > 0 && _tokenAddresses.length == _tokenSymbols.lendth == _tokenDecimals.lendth == _tokensPerTicket.length);
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            tokenPaymentList[_tokenAddresses[i]] = AxTokenInfo(_tokenAddresses[i],_tokenSymbols[i],_tokenDecimals[i],_tokensPerTicket[i]);
        }
        totalPaymentTokens = tokenPaymentList.length;
    }

    // Remove token payment list
    function removeTokenPaymentInfo(address[] _tokenAddresses) external activatedTokenPayment potIsClosed onlyOwner {
        require(_tokenAddresses.length > 0);
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            require(tokenPaymentList[_tokenAddresses[i]] != 0x0);
            delete(tokenPaymentList[_tokenAddresses[i]]);
        }
        totalPaymentTokens = tokenPaymentList.length;
    }

    // Buy tickets by ERC20 tokens
    // - Require which token must registered in payment list
    // - Assume that sender approved allowance for contract before
    // - Validate the allowance amount
    // - Complete tx as being successful or failed
    // - Update pot player ticket list
    // - Update pot plater list
    // - Update pot token amount list
    function PurchaseTicketsByERC20Tokens(address[] _tokenAddresses, uint[] _tokenAmountList) external activatedGame potIsActive activatedTokenPayment {
        require(_tokenAddresses.length > 0 && _tokenAddresses.length == _tokenAmountList.length);
        for (uint i = 0; i < _tokenAddresses.length; i++) {
            require(tokenPaymentList[_tokenAddresses[i]] != 0x0 && _tokenAmountList[i] > 0);
            address playerAddress = msg.sender;
            ERC20Interface = ERC20(_tokenAddresses[i]);
            if (_tokenAmountList[i] > ERC20Interface.allowance(playerAddress,address(this))) {
                emit TokenTransferFailed(playerAddress,address(this),_tokenAmountList[i]);
                revert();
            }
            ERC20Interface.transferFrom(playerAddress, address(this), _tokenAmountList[i]);
            uint ticketPrice = tokenPaymentList[_tokenAddresses[i]].amountPerTicket_;
            uint numberOfTickets = _tokenAmountList[i].div(ticketPrice);
            AxTokenAmount tokenAmount = AxTokenAmount(_tokenAddresses[i],_tokenAmountList[i]);
            potPlayerTicketList.push(AxPotPlayerTicket(playerAddress,0,0,totalTokenAmount.push(tokenAmount),ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets));

        }
    }

    // Fallback function for buy tickets by Ether
    function () external payable activatedGame potIsActive {
        purchaseTicketsByEther();
    }
    
    // Purchase tickets to players by ETH
    // - Validate tx by pot open timestamp range
    // - Receive ether amount
    // - Calculate relevant number of tickets
    // - Set ticket numbers to player's address 
    function purchaseTicketsByEther() public activatedGame potIsActive {
        // Receive Ether amount
        uint numberOfTickets = 0;
        totalWeiPot = totalWeiPot.add(msg.value);
        // Calculate relevant number of tickets
        numberOfTickets = msg.value.div(weiPerTicket);
        potPlayerTicketList.push(AxPotPlayerTicket(msg.sender,0,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets));
        lengthOfpotPlayerTicketList++;
        updatePotPlayerList(msg.sender,numberOfTickets);
        emit PurchaseTicketsByEther(msg.sender,msg.value,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets);
        ticketNumberCeiling = ticketNumberCeiling + numberOfTickets;
    }

    // Draw ticket
    // - Require pot closed
    // - Randow ticket number for prize
    // - Set end pot timestamp
    // - Register winner to list
    // - Allocate prize and fee
    // - Prepare opening next pot
    function drawTicket() external onlyOwner activatedGame potIsClosed {
        // Draw ticket
        uint winnerTicket = ticketNumberRandom();
        address winnerAddress = lookUpPlayerAddressByTicketNumber(winnerTicket);
        // uint winnerPrize = totalWeiPot.mul(1 - feeRate/100);
        // End pot
        potEndedTimestamp = now;
        // Update winner list
        // gameWinnerList.push(AxPotWinner(winnerAddress,winnerPrize,potEndedTimestamp));
        // lengthOfGameWinnerList++;
        updateGameWinnerList(winnerAddress);
        // Allocate prize and fee
        // winnerAddress.transfer(winnerPrize);
        // operatorAddress.transfer(totalWeiPot.sub(winnerPrize));
        allocatePrizeAndFeeByEtherAndTokens();
        // Prepare opening next pot
        prepareOpeningNextPot();

        emit DrawTicket(winnerAddress,winnerTicket,winnerPrize,potEndedTimestamp);
    }

    // Claim refund
    // function claimRefund() external returns (bool) {
    //     return true;
    // }

    // Prepare for opening next pot
    function prepareOpeningNextPot() {
        potOpenedTimestamp = potOpenedTimestamp + potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        totalWeiPot = 0;
        ticketNumberCeiling = 0;
        delete potPlayerTicketList;
        lengthOfpotPlayerTicketList = 0;
        delete potPlayerList;
        totalPotPlayers = 0;
        delete potTokenAmountList;
        totalPotTokens = 0;
    }

    // Look up owner by ticket number
    function lookUpPlayerAddressByTicketNumber(uint _ticketNumber) public view returns (address) {
        for (uint i = 0; i < potPlayerTicketList.length; i++) {
            uint ticketStartNumber = potPlayerTicketList[i].ticketStartNumber;
            uint ticketEndNumber = potPlayerTicketList[i].ticketEndNumber;
            if (_ticketNumber >= ticketStartNumber && _ticketNumber <= ticketEndNumber) {
                return potPlayerTicketList[i].playerAddress;
            }
        }
        return address(0);
    }

    // Look up ticket numbers by player address
    function lookUpTicketNumbersByPlayerAddress(address _playerAddress) public view returns (uint[100]) {
        uint[100] memory potTicketList;
        uint potTicketIdx = 0;
        for (uint i = 0; i < potPlayerTicketList.length; i++) {
            address playerAddress = potPlayerTicketList[i].playerAddress;
            uint ticketStartNumber = potPlayerTicketList[i].ticketStartNumber;
            uint ticketEndNumber = potPlayerTicketList[i].ticketEndNumber;
            if (playerAddress == _playerAddress) {
                potTicketList[potTicketIdx] = ticketStartNumber;
                potTicketIdx = potTicketIdx + 1;
                potTicketList[potTicketIdx] = ticketEndNumber;
                potTicketIdx = potTicketIdx + 1;
            }
        }
        return potTicketList;
    }

    // Update pot player list
    function updatePotPlayerList(address _player, uint _numberOfTickets, uint _totalWei, AxTokenAmount _totalTokenAmount)  {
        uint playerIndex = potPlayerIndexes[_player];
        if (potPlayerList.length > 0 && potPlayerList[playerIndex].playerAddress == _player) {
            potPlayerList[playerIndex].totalTickets += _numberOfTickets;
            potPlayerList[playerIndex].totalWei += _totalWei;
            bool isUpdated = false;
            for (uint i=0; i < potPlayerList[playerIndex].totalTokenAmount.length; i++) {
                if (potPlayerList[playerIndex].totalTokenAmount[i].contract_ == _totalTokenAmount.contract_) {
                    potPlayerList[playerIndex].totalTokenAmount[i].totalAmount_ += _totalTokenAmount.totalAmount_;
                    isUpdated = true;
                    break;
                }
            }
            if (isUpdated == false) {
                potPlayerList[playerIndex].totalTokenAmount.push(_totalTokenAmount);
            }
            return;
        } 
        playerIndex = potPlayerList.push(AxPotPlayerTicket(_player,_numberOfTickets,_totalWei,totalTokenAmount.push(_totalTokenAmount),0,0)) - 1;
        potPlayerIndexes[_player] = playerIndex;
        totalPotPlayers++;
    }

    // Update pot token amount list
    function updatePotTokenAmountList(address _token, uint _totalAmount) {
        uint tokenIndex = tokenIndexes[_token];
        if (potTokenAmountList.length > 0 && potTokenAmountList[tokenIndex] == _token) {
            potTokenAmountList[tokenIndex].totalAmount_ += _totalAmount;
            return;
        }
        tokenIndex = potTokenAmountList.push(AxTokenAmount(_token, _totalAmount)) - 1;
        potTokenAmountList[_token] = tokenIndex;
        totalPotTokens = potTokenAmountList.length;
    }

    // Update game winner list
    function updateGameWinnerList(address _potWinner) {
        AxTokenAmount[] totalPotTokenPrize;
        for (uint i=0; i < potTokenAmountList.length; i++) {
            totalPotTokenPrize.push(AxTokenAmount(potTokenAmountList[i].contract_,potTokenAmountList[i].totalAmount_.mul(1 - toeknFeeRate / 100)));
        }
        gameWinnerList.push(AxPotWinner(_potWinner,totalWeiPot.mul(1 - feeRate / 100),totalPotTokenPrize,potEndedTimestamp));
        lengthOfGameWinnerList++;
    }

    // Allocate prize and fee by Ether & Tokens
    function allocatePrizeAndFeeByEtherAndTokens() {
        address currentPotWinner = gameWinnerList[lengthOfGameWinnerList - 1].winnerAddress;
        uint totalWeiPrize = gameWinnerList[lengthOfGameWinnerList - 1].totalWei;
        AxTokenAmount[] totalTokensPrize = gameWinnerList[lengthOfGameWinnerList - 1].totalTokenAmount;
        currentPotWinner.transfer(totalWeiPrize);
        operatorAddress.transfer(totalWeiPot.sub(totalWeiPrize));
        for (uint i=0; i < totalTokensPrize.length; i++) {
            ERC20Interface = ERC20(totalTokensPrize[i].contract_);
            ERC20Interface.transfer(currentPotWinner,totalTokensPrize[i].totalAmount_);
            ERC20Interface.transfer(operatorAddress,totalTokensPrize[i].totalAmount_.mul(tokenFeeRate / (100 - tokenFeeRate)));           
        }
    }

    // Check current timestamp in smart contract
    function checkCurrentTimestamp() external view returns (uint) {
        return now;
    }

    // Random ticket number
    function ticketNumberRandom() private view returns (uint) {
        return LCGRandom() % ticketNumberCeiling;
    }

    // Linear Congruential Generator algorithm
    function LCGRandom() private view returns (uint) {
        uint seed = block.number;
        uint a = 1103515245;
        uint c = 12345;
        uint m = 2 ** 32;

        return (a * seed + c) % m;
    }
}