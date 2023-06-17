// Deploying UniswapV2
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();

  console.log("UniswapV2 Factory address:", factory.address);
  console.log("feeToSetter:", await factory.feeToSetter());

  let tokenA = "0xcD6a42782d230D7c13A74ddec5dD140e55499Df9";
  let tokenB = "0xaE036c65C649172b43ef7156b009c6221B596B8b";

  await factory.createPair(tokenA, tokenB);
  console.log("factory pair:", await factory.getPair(tokenA, tokenB));

  const Router02 = await ethers.getContractFactory("UniswapV2Router02");
  const router02 = await Router02.deploy(factory.address, factory.address);
  await router02.deployed();

  console.log("router pair:", await router02.pairAddress(tokenB, tokenA));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
