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

    // Constants
    
    // Variables
    address public operatorAddress; // Operator wallet address
    uint public potOpenedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potClosedTimestamp; // Pot opened timestamp, unix timestamp UTC
    uint public potEndedTimestamp; // Pot ended timestamp, unix timestamp UTC
    uint public potSellingPeriod; // Pot selling period (hs) for calculating pot closed timestamp
    uint public potOpeningPeriod; // Pot opening period (hs) for calculating next open timestamp
    bool public potActiveFlg; // Pot status flag
    bool public potAutoFlg; // Auto open pot flag
    uint public ticketEtherSingleSalePrice; // Single sale price for ticket by Ether
    uint public feeEtherRate; // fee rate by Ether must be excluded for game operator
    uint public minNumberOfPlayers; // minimum number of players required

    AxPotWinner[] public gameWinnerList; // List of winners in game
    mapping(uint => address) public potTicketPlayerList; // List of ticket and player in pot
    uint public totalPotTickets; // Total number of tickets sold in pot
    uint public drawnPotTicketNumber; // Drawn ticket number
    uint public totalPotEther; // Total Ether in pot

    // Constructor function
    constructor(address _operatorAddress, uint _pot1stOpenedTimestamp, uint _potSellingPeriod, uint _potOpeningPeriod, uint _potAutoFlg, uint _ticketEtherSingleSalePrice, uint _feeEtherRate, uint _minPlayers) public {
        require (_operatorAddress != address(0));
        operatorAddress = _operatorAddress;
        potOpenedTimestamp = _pot1stOpenedTimestamp;
        potSellingPeriod =_potSellingPeriod;
        potOpeningPeriod = _potOpeningPeriod;
        potClosedTimestamp = potOpenedTimestamp + potSellingPeriod;
        potAutoFlg = _potAutoFlg;
        ticketEtherSingleSalePrice = _ticketEtherSingleSalePrice;
        feeEtherRate = _feeEtherRate;
        minPlayers = _minPlayers;
        totalPotTickets = 0;
        drawnPotTicketNumber = 0;
        totalPotEther = 0;
    }

    // Set operator wallet address
    function setOperatorWalletAddress (address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0))
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
    function setPotSaleParams(uint _ticketEtherSingleSalePrice, uint _feeEtherRate, uint _minPlayers) external onlyOwner returns (bool) {
        ticketEtherSingleSalePrice = _ticketEtherSingleSalePrice;
        feeEtherRate = _feeEtherRate;
        minPlayers = _minPlayers;

        return true;
    }

    // Purchase tickets to players by ETH
    // - Validate tx by pot open timestamp range
    // - Receive ether amount
    // - Calculate relevant number of tickets
    // - Set ticket numbers to player's address
    function purchaseTicketsByEther() external payable {
        require(now >= potOpenedTimeStamp && now <= potClosedTimestamp);
        totalPotEther = totalPotEther.add(msg.value);
        uint numberTickets = msg.value.div(ticketEtherSingleSalePrice);
        for 
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