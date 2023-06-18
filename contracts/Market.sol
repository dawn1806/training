// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./UniswapV2/periphery/IUniswapV2Router02.sol";

import "hardhat/console.sol";

contract Market {

    address public immutable router;

    constructor (address router02) {
        router = router02;
    }

    event AddLiquidity(address tokenA, address tokenB, uint256 amountA, uint256 amountB, uint256 liquidity);

    function addLiquidity(address tokenA, address tokenB) external {
        IERC20(tokenA).transferFrom(msg.sender, address(this), 10000);
        IERC20(tokenB).transferFrom(msg.sender, address(this), 10000);
        IERC20(tokenA).approve(router, 10000);
        IERC20(tokenB).approve(router, 10000);
        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(router).addLiquidity(
            tokenA,
            tokenB,
            8000, 5000,
            8000, 5000,
            msg.sender,
            block.timestamp + 3600
        );
        
        emit AddLiquidity(tokenA, tokenB, amountA, amountB, liquidity);
    }
}
