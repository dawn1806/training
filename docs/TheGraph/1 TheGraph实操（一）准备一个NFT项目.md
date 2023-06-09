> 这是一个系列教程。通过自己实现一个 NFT 项目，讲解 The Graph 的使用。

<br>

**导航链接**

[TheGraph 实操（一）准备一个 NFT 项目]()  
[TheGraph 实操（二）创建 Graph 并初始化]()  
[TheGraph 实操（三）构造 entity 实现检索]()  
[TheGraph 实操（四）Graph 高级用法]()

---

<br>

**本篇是这个系列的第一篇：创建一个 NFT 合约并实现交易。**

_注：这里主要聚焦在 The Graph 的使用，自己实现 NFT 项目是为了方便解析事件，不关注 NFT 合约的安全等_

<br>

**创建合约**

1、实现一个标准的 ERC721 合约，通过这个合约发行 NFT，用 The Graph 解析 Transfer 事件。

```
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

<br>

2、实现一个标准的 ERC20 代币，用来买卖我们上面发行的 NFT。

```
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
```

<br>

3、实现一个 Market 合约，买卖 NFT

```
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

<br>

4、请使用你熟悉的工具（Remix/truffle/hardhat/foundry） 部署并验证合约

- 使用 hardhat 部署合约，这里部署到 mumbai 网络，也可部署到 bsc 测试网等

  - 申请 apikey（验证合约需要）  
    **重点：apikey 需要去 测试网 对应的 主网区块链浏览器 申请，需要注册登录**

    - 验证合约 即 把合约代码开源到区块链，通过区块链浏览器可以查看我们的合约代码
    - 验证合约后，The Graph 自动从区块链拉取我们的合约字节码，解析事件，如果不验证，也可以自己从本地指定 abi.json

  - 配置 hardhat.config.js

  ```
  module.exports = {
    solidity: "0.8.18",

    networks: {
        mumbai: {
            url: "可以在 alchemy.com 创建一个 endpoint",
            accounts: {
                mnemonic: mnemonic, // 助记词可以推导出多个账户
            },
            chainId: 80001,
        },
    },

    // 这个 scankey 是上面申请的apikey
    etherscan: {
        apiKey: scankey,
    },
  };
  ```

  - 部署：npx hardhat run ./scripts/deploy.js --network mumbai
  - 验证：npx hardhat verify 合约地址 参数 1 参数 2... --network mumbai

至此，本篇文章就结束了。如果有问题可以留言，我看到后会回复留言。
