//
const hre = require("hardhat");

async function main() {
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const ERC721Token = await hre.ethers.getContractFactory("ERC721Token");
  const Market = await hre.ethers.getContractFactory("Market");

  const token20 = await ERC20Token.deploy();
  const token721 = await ERC721Token.deploy();
  const market = await Market.deploy(token20.address, token721.address);

  console.log(`ERC20Token deployed to ${token20.address}`);
  console.log(`ERC721Token deployed to ${token721.address}`);

  await token20.deployed();
  await token721.deployed();
  await market.deployed();

  console.log(`Market deployed to ${market.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
