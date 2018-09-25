pragma solidity ^0.4.24;


contract Owner {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function changeOwner(address _newOwnerAddr) public onlyOwner {
        require(_newOwnerAddr != address(0));
        owner = _newOwnerAddr;
    }
}


library SafeMath {
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}


contract AxRaffle is Owner {
    using SafeMath for uint;

    // Structures
    // Pot Winner Info
    struct AxPotWinner {
        address winnerAddress;
        uint totalEther;
        uint potEndedTimestamp;
    }

    // Pot Player Info
    // Only store start and end ticket number to save space
    struct AxPotPlayer {
        address playerAddress;
        uint ticketStartNumber; 
        uint ticketEndNumber;
    }

    // Constants
    
    // Variables
    address public operatorAddress; // Operator wallet address

    // uint public minPotPlayers; // minimum number of players required
    uint public ticketEtherPrice; // Single sale price for ticket in gwei
    uint public feeRate; // fee rate (extracted from total prize) for game operator, input 10 <=> 10%
    bool public gameIsActive; // Active flag for Raffle game

    AxPotWinner[] public gameWinnerList; // List of winners in game

    uint public potSellingPeriod; // Pot selling period (hs) for calculating pot closed timestamp
    uint public potOpeningPeriod; // Pot opening period (hs) for calculating next open timestamp

    uint public potOpenedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potClosedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potEndedTimestamp; // Pot ended timestamp, unix timestamp UTC
    
    uint public ticketNumberCeiling; // current latest of ticket number, set to private later
    AxPotPlayer[] public potPlayerList; //list of players

    uint public totalEtherPot; // Total Ether in pot

    // Events
    event ActivateGame();
    event DeactivateGame();
    event PurchaseTicketsByEther(address playerAddress, uint etherAmount, uint startTicketNumber, uint endTicketNumber);
    event DrawTicket(address winnerAddress, uint winnerTicketNumber, uint winnerPrize, uint potEndedTimestamp);

    // Modifiers
    modifier activatedGame() {
        require(gameIsActive == true);
        _;
    }

    modifier potIsActive() {
        require(now >= potOpenedTimestamp && now <= potClosedTimestamp);
        _;
    }

    modifier potIsClosed() {
        require(now > potClosedTimestamp);
        _;
    }

    // Constructor function
    constructor(
        address _operatorAddress, 
        uint _pot1stOpenedTimestamp,
        uint _potSellingPeriod, 
        uint _potOpeningPeriod, 
        uint _ticketEtherPrice, 
        uint _feeRate
    ) public {
        require (_operatorAddress != address(0));
        operatorAddress = _operatorAddress;
        potOpenedTimestamp = _pot1stOpenedTimestamp;
        potSellingPeriod =_potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        ticketEtherPrice = _ticketEtherPrice;
        feeRate = _feeRate;
        totalEtherPot = 0;
        ticketNumberCeiling = 0;
    }

    // Set operator wallet address
    function setOperatorWalletAddress (address _operatorAddress) external onlyOwner returns (bool) {
        require(_operatorAddress != address(0));
        require(_operatorAddress != operatorAddress);
        operatorAddress = _operatorAddress;

        return true;
    }

    // Set pot auto flg, pot opened time stamp, pot selling period, pot opening period
    function setPotOpenParams(uint _potOpenedTimestamp, uint _potSellingPeriod, uint _potOpeningPeriod) external onlyOwner returns (bool) {
        potOpenedTimestamp = _potOpenedTimestamp;
        potSellingPeriod = _potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;

        return true;
    }

    // Set ticket Ether sale price, fee Ether rate, min players
    function setPotSaleParams(uint _ticketEtherPrice, uint _feeRate, uint _minPlayers) external onlyOwner returns (bool) {
        ticketEtherPrice = _ticketEtherPrice;
        feeRate = _feeRate;

        return true;
    }

    // Activate game
    function activateGame() external onlyOwner {
        gameIsActive = true;
        ActivateGame();
    }

    // Deactive game
    function deactivateGame() external onlyOwner {
        gameIsActive = false;
        DeactivateGame();
    }

    // Purchase tickets to players by ETH
    // - Validate tx by pot open timestamp range
    // - Receive ether amount
    // - Calculate relevant number of tickets
    // - Set ticket numbers to player's address
    function purchaseTicketsByEther() external payable activatedGame potIsActive {
        // Receive Ether amount
        uint numberOfTickets = 0;
        totalEtherPot = totalEtherPot.add(msg.value);
        // Calculate relevant number of tickets
        numberOfTickets = msg.value.mul(ticketEtherPrice); //test only, move this variable to inside function in real app
        potPlayerList.push(AxPotPlayer(msg.sender,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets));
        PurchaseTicketsByEther(msg.sender,msg.value,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets);
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
        uint winnerPrize = totalEtherPot.mul(1 - feeRate/100);
        // End pot
        potEndedTimestamp = now;
        // Register winner
        gameWinnerList.push(AxPotWinner(winnerAddress,winnerPrize,potEndedTimestamp));
        // Allocate prize and fee
        winnerAddress.transfer(winnerPrize);
        operatorAddress.transfer(totalEtherPot.sub(winnerPrize));
        // Prepare opening next pot
        prepareOpeningNextPot();

        DrawTicket(winnerAddress,winnerTicket,winnerPrize,potEndedTimestamp);
    }

    // Claim refund
    // function claimRefund() external returns (bool) {
    //     return true;
    // }

    // Prepare for opening next pot
    function prepareOpeningNextPot() {
        potOpenedTimestamp = potOpenedTimestamp + potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        totalEtherPot = 0;
        ticketNumberCeiling = 0;
        delete potPlayerList;
    }

    // Look up owner by ticket number
    function lookUpPlayerAddressByTicketNumber(uint _ticketNumber) public view returns (address) {
        for (uint i = 0; i < potPlayerList.length; i++) {
            uint ticketStartNumber = potPlayerList[i].ticketStartNumber;
            uint ticketEndNumber = potPlayerList[i].ticketEndNumber;
            if (_ticketNumber >= ticketStartNumber && _ticketNumber <= ticketEndNumber) {
                return potPlayerList[i].playerAddress;
            }
        }
        return address(0);
    }

    // Look up ticket numbers by player address
    function lookUpTicketNumbersByPlayerAddress(address _playerAddress) public view returns (uint[]) {
        uint[] potTicketList;
        for (uint i = 0; i < potPlayerList.length; i++) {
            address playerAddress = potPlayerList[i].playerAddress;
            uint ticketStartNumber = potPlayerList[i].ticketStartNumber;
            uint ticketEndNumber = potPlayerList[i].ticketEndNumber;
            if (playerAddress == _playerAddress) {
                potTicketList.push(ticketStartNumber);
                potTicketList.push(ticketEndNumber);
            }
        }
        return potTicketList;
    }

    // Check current timestamp in smart contract
    function checkCurrentTimestamp() external view returns (uint) {
        return now;
    }

    // Random ticket number
    function ticketNumberRandom() returns (uint) {
        return LCGRandom() % ticketNumberCeiling;
    }

    // Linear Congruential Generator algorithm
    function LCGRandom() returns (uint) {
        uint seed = block.number;
        uint a = 1103515245;
        uint c = 12345;
        uint m = 2 ** 32;

        return (a * seed + c) % m;
    }
}