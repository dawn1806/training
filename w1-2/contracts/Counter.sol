// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 已部署已验证合约地址： 0xE33cf7Df16B2B683F5e8b71EA11Ae91fE3d9E1F1
contract Counter {
    uint public counter;
    address public owner;

    constructor(uint x) {
        counter = x;
        owner = msg.sender;
    }

    function count() public {
        require(msg.sender == owner, "invalid call");
        counter = counter + 1;
    }
}