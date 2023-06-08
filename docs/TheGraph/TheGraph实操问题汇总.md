# 创建项目

1. 部署一个 ERC20 代币

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    constructor() ERC20(unicode"猫币", "CAT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }

}
```

2. 部署一个 ERC721 的 NFT

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Token is ERC721 {

    string public baseURI;

    constructor() ERC721(unicode"小猫", "LCAT") {

    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string calldata uri) external {
        baseURI = uri;
    }

    function safeMint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }

}
```

3. 部署一个 Market 合约使用 20 代币 买卖 NFT

```
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

```

4. 使用 hardhat 部署合约
   - 申请 apikey
   - 配置 hardhat.config.js
   - npx hardhat run ./scripts/market.js --network bscTest
   - npx hardhat verify 合约地址 参数 1 参数 2... --network bscTest

# 使用 Graph 索引交易数据 创建与初始化

1. 创建 subgraph
2. 安装本地环境

   ```
   yarn global add @graphprotocol/graph-cli

   graph init --product hosted-service dawn303/hub
       > Protocol · ethereum
       > Ethereum network · mumbai
       > Contract address ›
   ```

# The Graph 特点

- 托管服务 - 免费
- 分布式服务 - GRT 查询手续费、用于激励 indexer 提供服务，类似与区块链的 gas
- 无后端服务器，只需要前端服务器
- 自建服务 - rpc 不稳定、限流等
- 直接查区块链不方便，Graph 可以直接聚合索引
- bsc testnet 支持 叫 chapel
