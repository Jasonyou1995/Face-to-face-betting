// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BetVerifier {
    struct Bet {
        address creator;
        address taker;
        uint256 amount;
        string condition;
        bool isResolved;
        address winner;
    }

    mapping(bytes32 => Bet) public bets;

    event BetCreated(bytes32 indexed betId, address creator, uint256 amount);
    event BetTaken(bytes32 indexed betId, address taker);
    event BetResolved(bytes32 indexed betId, address winner);

    function createBet(string memory condition) public payable returns (bytes32) {
        bytes32 betId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        
        bets[betId] = Bet({
            creator: msg.sender,
            taker: address(0),
            amount: msg.value,
            condition: condition,
            isResolved: false,
            winner: address(0)
        });

        emit BetCreated(betId, msg.sender, msg.value);
        return betId;
    }

    // Additional functions for bet management
} 