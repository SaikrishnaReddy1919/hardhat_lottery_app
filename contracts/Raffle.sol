/**
 * Goal :
 * Raffle contract
 *
 * Allow anyone to enter the lottery(By paying some amount)
 * Pick a random winner (verifyably random)
 * Winner need to be selected for every X minutes -> completly automated
 * Chainlink Oracles -> For Randomness and Automated Execution(Chainlink Keepers)
 */

//SPDX License_Identifier: MIT

pragma solidity ^0.8.7;

error Raffle_NotEnoughETHEntered();

contract Raffle {
    // ----Storage Variables----
    uint256 private immutable i_entranceFee;
    address payable[] private s_players; 

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    function getEntractnceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function enterRaffle() public payable {
        //require msg.value should be > min value
        if (msg.value < i_entranceFee) {
            revert Raffle_NotEnoughETHEntered();
        }
        s_players.push(payable(msg.sender));
        //Events
    }
}
