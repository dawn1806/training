// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault {

    // 1. 编写⼀个⾦库 Vault 合约：
    // 2. 编写 deposite ⽅法，实现 ERC20 存⼊ Vault，并记录每个⽤户存款⾦额（approve/transferFrom）
    // 3. 编写 withdraw ⽅法，提取⽤户⾃⼰的存款

    // 代币
    address public immutable token;

    // 记录用户存款金额
    mapping(address => uint256) public depositOf;

    constructor(address token_) {
        token = token_;
    }

    function deposite(uint256 deposit) external {
        IERC20(token).transferFrom(msg.sender, address(this), deposit);
        depositOf[msg.sender] += deposit;
    }

    function withdraw() external {
        uint256 deposit = depositOf[msg.sender];
        depositOf[msg.sender] = 0;
        IERC20(token).transfer(msg.sender, deposit);
    }

}
