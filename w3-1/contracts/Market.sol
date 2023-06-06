// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Market {
    address public token1;
    address public token2;

    mapping(uint256=>uint256) public priceOf;

    constructor() {}

    function setToken(address token20, address token721) external {
        token1 = token20;
        token2 = token721;
    }

    function buy(uint256 tokenId, uint256 amount) external {
        uint256 price = priceOf[tokenId];
        require(price > 0 && price <= amount, "buy: error price or amount");
        IERC20(token1).transferFrom(msg.sender, IERC721(token2).ownerOf(tokenId), price);
        IERC721(token2).transferFrom(address(this), msg.sender, tokenId);
    }

    function sell(uint256 tokenId, uint256 price) external {
        IERC721(token2).transferFrom(msg.sender, address(this), tokenId);
        priceOf[tokenId] = price;
    }
}
