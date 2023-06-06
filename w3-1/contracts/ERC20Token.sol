// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    constructor() ERC20(unicode"Dawn的代币", "DAWN") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
    
}
