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
        uint potEndedTimestamp;
    }

    // Pot Player Info
    // Only store start and end ticket number to save space
    struct AxPotPlayerTicket {
        address playerAddress;
        uint totalTickets;        
        uint ticketStartNumber; 
        uint ticketEndNumber;
    }

    // Constants
    
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

    // Events
    event ActivateGame(bool _active);
    event DeactivateGame(bool _deactive);
    event PurchaseTicketsByEther(address playerAddress, uint weiAmount, uint startTicketNumber, uint endTicketNumber);
    event DrawTicket(address winnerAddress, uint winnerTicketNumber, uint winnerPrize, uint potEndedTimestamp);

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

    // Set ticket Ether sale price, fee Ether rate, min players
    function setPotSaleParams(uint _weiPerTicket, uint _feeRate) external onlyOwner {
        weiPerTicket = _weiPerTicket;
        feeRate = _feeRate;
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
        uint winnerPrize = totalWeiPot.mul(1 - feeRate/100);
        // End pot
        potEndedTimestamp = now;
        // Register winner
        gameWinnerList.push(AxPotWinner(winnerAddress,winnerPrize,potEndedTimestamp));
        lengthOfGameWinnerList++;
        // Allocate prize and fee
        winnerAddress.transfer(winnerPrize);
        operatorAddress.transfer(totalWeiPot.sub(winnerPrize));
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
    function lookUpTicketNumbersByPlayerAddress(address _playerAddress) public view returns (uint[]) {
        uint[] potTicketList;
        for (uint i = 0; i < potPlayerTicketList.length; i++) {
            address playerAddress = potPlayerTicketList[i].playerAddress;
            uint ticketStartNumber = potPlayerTicketList[i].ticketStartNumber;
            uint ticketEndNumber = potPlayerTicketList[i].ticketEndNumber;
            if (playerAddress == _playerAddress) {
                potTicketList.push(ticketStartNumber);
                potTicketList.push(ticketEndNumber);
            }
        }
        return potTicketList;
    }

    // Update pot player list
    function updatePotPlayerList(address _player, uint _numberOfTickets)  {
        uint256 playerIndex = potPlayerIndexes[_player];
        if (potPlayerList.length > 0 && potPlayerList[playerIndex].playerAddress == _player)
        {
            potPlayerList[playerIndex].totalTickets += _numberOfTickets;
            return;
        } 
        playerIndex = potPlayerList.push(AxPotPlayerTicket(_player,_numberOfTickets,0,0)) - 1;
        potPlayerIndexes[_player] = playerIndex;
        totalPotPlayers++;
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