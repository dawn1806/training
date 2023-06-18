// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    address public immutable owner;

    constructor() ERC20("Dawn", "DA") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
        owner = msg.sender;
    }

}
