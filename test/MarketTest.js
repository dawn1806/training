const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  async function deployLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const UniswapV2Factory = await ethers.getContractFactory(
      "UniswapV2Factory"
    );
    const uniswapV2Factory = await UniswapV2Factory.deploy(owner.address);

    const UniswapV2Router02 = await ethers.getContractFactory(
      "UniswapV2Router02"
    );
    const uniswapV2Router02 = await UniswapV2Router02.deploy(
      uniswapV2Factory.address,
      uniswapV2Factory.address
    );

    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    const tokenA = await ERC20Token.deploy();
    const tokenB = await ERC20Token.deploy();

    const Market = await ethers.getContractFactory("Market");
    const market = await Market.deploy(uniswapV2Router02.address);

    return {
      uniswapV2Factory,
      uniswapV2Router02,
      tokenA,
      tokenB,
      market,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("UniswapV2 部署成功", async function () {
      const { uniswapV2Factory, uniswapV2Router02 } = await loadFixture(
        deployLockFixture
      );

      expect(await uniswapV2Router02.factory()).to.equal(
        uniswapV2Factory.address
      );
    });

    it("Market 部署成功", async function () {
      const { market, uniswapV2Router02 } = await loadFixture(
        deployLockFixture
      );

      expect(await market.router()).to.equal(uniswapV2Router02.address);
    });

    it("Market 添加流动性", async function () {
      const { tokenA, tokenB, market, owner } = await loadFixture(
        deployLockFixture
      );

      console.log("tokenA address: ", tokenA.address);
      console.log("tokenB address: ", tokenB.address);
      console.log("market address: ", market.address);
      console.log("owner address: ", owner.address);

      await tokenA.approve(market.address, 10000);
      await tokenB.approve(market.address, 10000);

      //   const tx = await market.addLiquidity(tokenA.address, tokenB.address);
      //   const receipt = await tx.wait();
      //   console.log(receipt.logs);

      await expect(market.addLiquidity(tokenA.address, tokenB.address))
        .to.emit(market, "AddLiquidity")
        .withArgs(
          printString,
          "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
          8000,
          5000,
          printUint
        );
    });
  });
});

function printString(s) {
  console.log("print ==> ", s);
  return true;
}

function printUint(u) {
  console.log("print ==> ", u.toNumber());
  return true;
}
