// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract SimpleContract1 {
  string b;

  constructor(string memory b_) {
    b = b_;
  }

  function caller2() view public returns(string memory) {
    return b;
  }
}
