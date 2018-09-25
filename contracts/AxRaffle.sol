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

    //Example: player A (first player of current pot) buys 1000 tickets, he will be assigned tickets 1-1000
    //player B (second player) buys 300 tickets, he will be assign tickets 1001-1300
    struct AxPotPlayer {
        address playerAddress;
        uint ticketStartNumber; //only store start and end ticket number to save space
        uint ticketEndNumber;
    }

    // Constants
    
    // Variables
    address public operatorAddress; // Operator wallet address

    uint public minNumberOfPlayers; // minimum number of players required
    uint public ticketPrice; // Single sale price for ticket in gwei
    uint public feeRate; // fee rate (extracted from total prize) for game operator
    bool public potAutoFlg; // Auto open pot flag

    AxPotWinner[] public gameWinnerList; // List of winners in game

    uint public potSellingPeriod; // Pot selling period (hs) for calculating pot closed timestamp
    uint public potOpeningPeriod; // Pot opening period (hs) for calculating next open timestamp

    uint public potOpenedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potClosedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potEndedTimestamp; // Pot ended timestamp, unix timestamp UTC

    bool public potActiveFlg; // Pot status flag
    
    uint public ticketNumberCeiling; // current latest of ticket number, set to private later
    AxPotPlayer[] public potPlayerList; //list of players

    uint public totalEtherPot; // Total Ether in pot

    event PurchaseTicketByEther(address playerAddress, uint etherAmount, uint startTicketNumber, uint endTicketNumber);
    event DrawTicket(address winnerAddress, uint winnerTicketNumber, uint winnerPrize, uint potEndedTimestamp);

    // Constructor function
    constructor(
        address _operatorAddress, 
        uint _pot1stOpenedTimestamp,
        uint _potSellingPeriod, 
        uint _potOpeningPeriod, 
        bool _potAutoFlg, 
        uint _ticketPrice, 
        uint _feeRate, 
        uint _minPlayers
    ) public {
        require (_operatorAddress != address(0));
        operatorAddress = _operatorAddress;
        potOpenedTimestamp = _pot1stOpenedTimestamp;
        potSellingPeriod =_potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        potAutoFlg = _potAutoFlg;
        ticketPrice = _ticketPrice;
        feeRate = _feeRate;
        minNumberOfPlayers = _minPlayers;
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
    function setPotOpenParams(bool _potAutoFlg, uint _potOpenedTimestamp, uint _potSellingPeriod, uint _potOpeningPeriod) external onlyOwner returns (bool) {
        potAutoFlg = _potAutoFlg;
        potOpenedTimestamp = _potOpenedTimestamp;
        potSellingPeriod = _potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;

        return true;
    }

    // Set ticket Ether sale price, fee Ether rate, min players
    function setPotSaleParams(uint _ticketPrice, uint _feeRate, uint _minPlayers) external onlyOwner returns (bool) {
        ticketPrice = _ticketPrice;
        feeRate = _feeRate;
        minNumberOfPlayers = _minPlayers;

        return true;
    }

    // Purchase tickets to players by ETH
    // - Validate tx by pot open timestamp range
    // - Receive ether amount
    // - Calculate relevant number of tickets
    // - Set ticket numbers to player's address
    function purchaseTicketsByEther() external payable returns (uint) {
        //require(now >= potOpenedTimestamp && now <= potClosedTimestamp); // temporary disable for testing other funcs
        //should implement some function to restrict msg.value to numbers that % 5 == 0
        //msg.value is in wei
        uint public numberOfTickets = 0; //for testing purpose only
        totalEtherPot = totalEtherPot.add(msg.value);
        numberOfTickets = msg.value.div(ticketPrice); //test only, move this variable to inside function in real app
        potPlayerList.push(AxPotPlayer(msg.sender,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets));

        PurchaseTicketByEther(msg.sender,msg.value,ticketNumberCeiling + 1,ticketNumberCeiling + numberOfTickets);
        
        ticketNumberCeiling = ticketNumberCeiling + numberOfTickets;
    }

    // Draw ticket
    // - Randow ticket number for prize
    // - Set end pot timestamp
    // - Register winner to list
    // - Allocate prize and fee
    // - Prepare for opening next pot
    function drawTicket() external onlyOwner {
        uint winnerTicket = ticketNumberRandom();
        address winnerAddress = lookUpTicketOwner(winnerTicket, potPlayerList);
        uint winnerPrize = totalEtherPot.mul(1 - feeRate);
        potEndedTimestamp = now;
        gameWinnerList.push(AxPotWinner(winnerAddress,winnerPrize,potEndedTimestamp));
        allocatePrizeAndFee();
        prepareOpeningNextPot();
        DrawTicket(winnerAddress,winnerTicket,winnerPrize,potEndedTimestamp);
    }

    // Claim refund
    function claimRefund() external returns (bool) {
        return true;
    }

    // Allocate prize to winner and fee to operator
    function allocatePrizeAndFee() {
        gameWinnerList[gameWinnerList.length].winnerAddress.transfer(gameWinnerList[gameWinnerList.length].totalEther);
        operatorAddress.transfer(totalEtherPot.sub(gameWinnerList[gameWinnerList.length].totalEther));
    }

    // Prepare for opening next pot
    function prepareOpeningNextPot() {
        potOpenedTimestamp = potOpenedTimestamp + potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        totalEtherPot = 0;
        ticketNumberCeiling = 0;
        delete potPlayerList;
    }

    // Look up owner by ticket number
    function lookUpTicketOwner(uint _ticketNumber, AxPotPlayer[] _potPlayerList) return (address) {
        for (uint i = 0; i < _potPlayerList.length; i++) {
            if (_ticketNumber >= _potPlayerList[i].ticketStartNumber && _ticketNumber <= _potPlayerList[i].ticketEndNumber) {
                return _potPlayerList[i].playerAddress;
            }
        }
        return address(0);
    }

    // Random ticket number
    function ticketNumberRandom() return (uint) {
        return LCGRandom() % ticketNumberCeiling;
    }

    // Linear Congruential Generator algorithm
    function LCGRandom() public return (uint) {
        uint seed = block.number;
        uint a = 1103515245;
        uint c = 12345;
        uint m = 2 ** 32;

        return (a * seed + c) % m;
    }
}