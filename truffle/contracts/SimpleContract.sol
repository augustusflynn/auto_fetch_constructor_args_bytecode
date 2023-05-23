// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract SimpleContract {
  uint256 a;

  constructor(uint256 a_) {
    a = a_;
  }

  function caller1() view public returns(uint256) {
    return a;
  }
}
