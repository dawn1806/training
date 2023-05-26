// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Counter {

    uint256 public count;

    function add(uint256 x) external {
        count = count + x;
    }
}
