//
const hre = require("hardhat");

async function main() {
  let ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  let ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
  let Market = await hre.ethers.getContractFactory("Market");

  // let [a, b] = await hre.ethers.getSigners();
  // ERC20Token = ERC20Token.connect(b);
  // ERC721Token = ERC721Token.connect(b);
  // Market = Market.connect(b);

  const token20 = await ERC20Token.deploy();
  const token721 = await ERC721Token.deploy();
  const market = await Market.deploy(token20.address, token721.address);

  await token20.deployed();
  await token721.deployed();
  await market.deployed();

  console.log(`ERC20Token deployed to ${token20.address}`); // mumbai 0x430291dbD89D7f00aF3BEB0dFE9df6C8c7F4714F
  console.log(`ERC721Token deployed to ${token721.address}`); // mumbai 0x60369410C0B3413bAB0351C488050eB74d6C860C
  console.log(`Market deployed to ${market.address}`); // mumbai 0x0f16366b795F88825bD69254D3814F106a762EF8
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
