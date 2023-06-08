// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Market {
    IERC20 public immutable TOKEN20;
    IERC721 public immutable TOKEN721;

    mapping(uint256 => uint256) public priceOf;
    mapping(uint256 => address) public sellerOf;

    constructor(address token20, address token721) {
        TOKEN20 = IERC20(token20);
        TOKEN721 = IERC721(token721);
    }

    event BuyEvent(address user, uint256 tokenId, uint256 amount);
    event SellEvent(address user, uint256 tokenId, uint256 price);

    function buy(uint256 tokenId, uint256 amount) external {
        uint256 price = priceOf[tokenId];
        require(price > 0 && price <= amount, "buy: error price or amount");
        require(sellerOf[tokenId] != address(0), "buy: seller address zero");
        TOKEN20.transferFrom(msg.sender, sellerOf[tokenId], price);
        TOKEN721.transferFrom(address(this), msg.sender, tokenId);
        priceOf[tokenId] = 0;
        sellerOf[tokenId] = address(0);
        emit BuyEvent(msg.sender, tokenId, price);
    }

    function sell(uint256 tokenId, uint256 price) external {
        TOKEN721.transferFrom(msg.sender, address(this), tokenId);
        sellerOf[tokenId] = msg.sender;
        priceOf[tokenId] = price;
        emit SellEvent(msg.sender, tokenId, price);
    }
}
