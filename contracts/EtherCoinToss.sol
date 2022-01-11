// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol"; // imports chainlink

contract EtherCoinToss is VRFConsumerBase {
    // testing with hard-coded values - not to be used in production
    constructor()
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709 // LINK Token
        )
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18;
    }

    function getRandomNumber() public returns (bytes32 requestId) { // Callback function for VRF
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    // Sets the random number 
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override 
    {
        randomResult = randomness;
    }

    struct EtherCoinTossStruct { // Struct for storing the coin toss
        uint256 ID;
        address payable betStarter;
        uint256 startingWager;
        address payable betEnder;
        uint256 endingWager;
        uint256 etherTotal;
        address payable winner;
        address payable loser;
    }

    // Variables for working with Chainlink's VRF
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;


    uint256 numCoinToss = 300; // Number of coin tosses - this becomes the ID of the game
    mapping(uint256 => EtherCoinTossStruct) EtherCoinTossStructs; // Mapping to store all the coin toss games

    event EtherCoinTossed(uint256 indexed theCoinTossID); // Event to 
    // Events are similar to functions but they are not payable and do not return a value

    // Start the Ether coin toss
    function newCoinToss() public payable returns (uint256 coinTossID) {
        address theBetStarter = msg.sender; // Converting the sender to a payable address
        address payable player1 = payable(theBetStarter);

        coinTossID = numCoinToss++; // Increase number of coin tosses by 1 every time a game is started

        EtherCoinTossStructs[coinTossID] = EtherCoinTossStruct( // Create a new coin toss game identified by coinTossID
            coinTossID,
            player1,
            msg.value,
            player1,
            msg.value,
            0,
            player1,
            player1
        );
        emit EtherCoinTossed(coinTossID); // Emit the event to tell the player the coinTossID
    }

    event EtherCoinFinishedToss(address indexed winner); // Create the event for player 2 to find out who the winner is

    // End the Ether coin toss
    function endCoinToss(uint256 coinTossID) public payable {
        EtherCoinTossStruct memory c = EtherCoinTossStructs[coinTossID]; // Store the coin toss game in memory

        address theBetender = msg.sender; // Converting player 2 to payable address again
        address payable player2 = payable(theBetender);

        // Require statements to make sure the coinTossID is valid and player 2 sends an equal amount of Ether
        require(coinTossID == c.ID);
        require(msg.value == c.startingWager);

        // Update variables inside the coin toss game
        c.betEnder = player2;
        c.endingWager = msg.value;
        c.etherTotal = c.startingWager + c.endingWager;

        fulfillRandomness(getRandomNumber(), coinTossID); // Call the random function and pass in the coinTossID as a parameter

        // Create a simple if else statement to determine the winner and send the Ether winnings
        if ((randomResult % 2) == 0) {
            c.winner = c.betStarter;
        } else {
            c.winner = c.betEnder;
        }

        c.winner.transfer(c.etherTotal);
        emit EtherCoinFinishedToss(c.winner); // Emit the event to tell player 2 the winner
    }
}