// SPDX-License-Identifier: GPL-3.0

/**
  * Authored by Toby Algya
  * July 30th, 2024
  * EveryRealm Code challenge
  * Rock Paper Scissors
  **/

pragma solidity 0.8.26;

contract RockPaperScissors {
    // mapping(address => )
    // mapping(uint256 => address) public games;
    address public player = address(0);
    uint8 public playCount = 0;
    uint8[6] public game = [uint8(0), 0 , 0];
    uint8[3] public rules = [uint8(2), 0, 1];

    // errors
    error SetInitialDeposit();
    error InsufficientDeposit();
    error NotCurrentPlayer();
    error GameIsOver();
    error GameInPlay();

    // Deploy with 1 Ether
    constructor() payable {
        if (msg.value != 1 ether) {
            revert SetInitialDeposit();
        }
    }

    // deposit 1 Ether to play
    function start() public payable returns (bool) {
        if (msg.value != 1 ether) {
            revert InsufficientDeposit();
        }
        player = msg.sender;
        return true;
    }

    // play hand
    function play(uint8 hand_) public returns (uint8 computer) {
        if (msg.sender != player) {
            revert NotCurrentPlayer();
        }
        if (playCount > 2) {
            revert GameIsOver();
        }
        computer = uint8((block.timestamp + hand_) % 3);
        game[playCount] = hand_;
        game[playCount+3] = computer;
        playCount++;
        return computer;
    }

    function redeem() public payable {
        if (playCount != 3) {
            revert GameInPlay();
        }
        if (msg.sender != player) {
            revert NotCurrentPlayer();
        }
        uint256 _playerTotal = 0;
        uint256 _compTotal = 0;
        for (uint256 i = 0; i < (game.length / 2); i++) {
            if (game[i] == game[i+3]) {
                _playerTotal++;
                _compTotal++;
            }
            else if (game[i+3] == rules[game[i]]) {
                _compTotal++;
            }
            else {
                _playerTotal++;
            }
            game[i] = 0;
            game[i+3] = 0;
        }
        address sender = player;
        player = address(0);
        playCount = 0;
        if (_playerTotal == _compTotal) {
            payable(sender).transfer(1 ether);
        }
        else if (_playerTotal > _compTotal) {
            payable(sender).transfer(2 ether);
        }
    }


}