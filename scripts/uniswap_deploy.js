// Deploying UniswapV2
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();

  console.log("UniswapV2 Factory address:", await factory.address);
  console.log("feeToSetter:", await factory.feeToSetter());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
