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
    struct player {
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
    
    uint public numberOfPlayers; // current number of player
    uint public ticketNumberCeiling = 0; // current latest of ticket number, set to private later
    //mapping(uint => address) public potTicketPlayerList; // List of ticket and player in current pot
    player[] public playerList; //list of players
    uint public totalPotTickets; // Total number of tickets sold in current pot

    uint public drawnPotTicketNumber; // Drawn ticket number
    uint public totalPrize; // Total Ether in pot

    // Constructor function
    constructor(address _operatorAddress, 
    uint _pot1stOpenedTimestamp,
    uint _potSellingPeriod, 
    uint _potOpeningPeriod, 
    bool _potAutoFlg, 
    uint _ticketPrice, 
    uint _feeRate, 
    uint _minPlayers) public {
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
        totalPotTickets = 0;
        drawnPotTicketNumber = 0;
        totalPrize = 0;
    }

    // Set operator wallet address
    function setOperatorWalletAddress (address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0));
        require(_operatorAddress != operatorAddress);
        operatorAddress = _operatorAddress;
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

    uint public numberOfTickets = 0; //for testing purpose only

    // Purchase tickets to players by ETH
    // - Validate tx by pot open timestamp range
    // - Receive ether amount
    // - Calculate relevant number of tickets
    // - Set ticket numbers to player's address
    function purchaseTicketsByEther() external payable returns (uint) {
        //require(now >= potOpenedTimestamp && now <= potClosedTimestamp); // temporary disable for testing other funcs
        //should implement some function to restrict msg.value to numbers that % 5 == 0

        //msg.value is in wei
        totalPrize = totalPrize.add(msg.value);
        numberOfTickets = msg.value.div(ticketPrice); //test only, move this variable to inside function in real app
        playerList.push(player(msg.sender, ticketNumberCeiling + 1, ticketNumberCeiling + numberOfTickets));
        numberOfPlayers++;
        ticketNumberCeiling = ticketNumberCeiling + numberOfTickets;
    }

    // Draw ticket
    function drawTicket() external returns (bool) {
        return true;
    }

    // Claim refund
    function claimRefund() external returns (bool) {
        return true;
    }

    // Allocate prize to winner and fee to operator
    function allocatePrizeAndFee() public returns (bool) {
        return true;
    }
}