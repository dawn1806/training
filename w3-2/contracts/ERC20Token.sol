// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    address public immutable owner;

    constructor() ERC20(unicode"猫币", "CAT") {
        owner = msg.sender;
        _mint(owner, 100000 * 10 ** decimals());
    }

    function mint(address account, uint256 amount) public {
        require(msg.sender == owner, "mint: only owner");
        _mint(account, amount);
    }
    
}
