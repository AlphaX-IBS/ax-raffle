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
    uint public potOpenedTimeStamp; // Pot opened timestamp, unix timestamp UTC
    uint public potClosedTimeStamp; // Pot opened timestamp, unix timestamp UTC
    uint public potEndedTimestamp; // Pot ended timestamp, unix timestamp UTC
    uint public potSellingPeriod; // Pot selling period (hs) for calculating pot closed timestamp
    uint public potOpeningPeriod; // Pot opening period (hs) for calculating next open timestamp
    bool public potActiveFlg; // Pot status flag
    bool public potAutoFlg; // Auto open pot flag
    uint public ticketEtherSingleSalePrice; // Single sale price for ticket by Ether
    uint public feeEtherRate; // fee rate by Ether must be excluded for game operator
    uint public minNumberOfPlayers; // minimum number of players required

    AxPotWinner[] public gameWinnerList; // List of winners in game
    mapping(address => uint) public potPlayerTicketList; // List of players and tickets in pot
    uint[] public potTicketList; // List of ticket 
    uint public drawnPotTicketNumber; // Drawn ticket number

    uint public totalCollectedEther; // Total Ether collected from sold tickets 

    // Constructor function
    constructor(address _operatorAddress, uint _pot1stOpenedTimestamp, uint _potSellingPeriod, uint _potOpeningPeriod, uint _potAutoFlg, uint _ticketEtherSingleSalePrice, uint _feeEtherRate, uint _minPlayers) public {
        require (_operatorAddress != address(0));
        operatorAddress = _operatorAddress;
    }

    // Set operator wallet address
    function setOperatorWalletAddress (address _operatorAddress) external onlyOwner {
        require(_operatorAddress != address(0))
        require(_operatorAddress != operatorAddress);
        operatorAddress = _operatorAddress;
    }

    // Purchase tickets to players by ETH
    function purchaseTicketsByEther() external payable returns (bool) {

    }

    // Draw ticket
    function drawTicket() external returns (bool) {

    } 
}