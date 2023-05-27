// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Bank {

    mapping (address=>uint256) public balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        require(balances[msg.sender] > 0, "withdraw 0");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(balances[msg.sender]);
    }

}
