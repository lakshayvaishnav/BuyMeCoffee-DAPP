const hre = require("hardhat");

async function main() {
  const buyCoffee = await hre.ethers.getContractFactory("Coffee");
  const buycoffee = await buyCoffee.deploy();

  await buycoffee.waitForDeployment();
  console.log("contract successfully deployled to :  ", buycoffee.target);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
