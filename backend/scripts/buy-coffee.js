const hre = require("hardhat");

async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.formatEther(balance);
}

async function printBalance(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(
      ` balance of account ${idx + 1} is : ${await getBalance(address)} `
    );
    idx++;
  }
}

async function printMemos(memos) {
  for (const memo of memos) {
    const name = memo.name;
    const message = memo.message;
    const useraddress = memo.userAddress;
    const timestamp = memo.timestamp;
    const amount = hre.ethers.formatEther(memo.amount);
    console.log(
      `At ${timestamp} ${useraddress} ${name} sends ${amount} saying ${message}`
    );
  }
}

async function main() {
  // fetching the test accounts from hardhat.
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // get the contract to deploy

  const BuyCoffee = await hre.ethers.getContractFactory("Coffee");
  const buyCoffee = await BuyCoffee.deploy();

  // wait for deployments;
  buyCoffee.waitForDeployment();
  console.log("coffee contract deployed successfully to  : ", buyCoffee.target);

  // check the balances of signers
  const addresses = [owner.address, tipper1.address, buyCoffee.target];
  console.log("== start ===");
  console.log("addresses are : - ", addresses);

  // fetches the balance.
  printBalance(addresses);

  // buy the owner few coffess
  const tip = await { value: hre.ethers.parseEther("100") };

  // connecting to the signers with contract and calling the buyCoffee `function
  await buyCoffee.connect(tipper1).buyCoffee("lxsh", "enjoy bruh...");

  await buyCoffee.connect(tipper2).buyCoffee("jane", "marry jane coffee", tip);

  await buyCoffee
    .connect(tipper3)
    .buyCoffee("emma wattson", "naag shakti coffee", tip);

  // check balance after coffe purchases.
  console.log("\n");
  console.log("=====After Coffee Purchase=====");
  await printBalance(addresses);

  // logging the contract balance.
  console.log("-------------------------------------------------");
  console.log("\n");
  let balance = await buyCoffee.connect(owner).getBalance();
  console.log(
    "contract current balance :  - ",
    hre.ethers.formatEther(balance)
  );

  // withdraw functtion.
  console.log("\n");
  console.log("After withdrawal ");
  await buyCoffee.connect(owner).withdrawFunds();

  balance = await buyCoffee.connect(owner).getBalance();
  console.log(
    "contract current balance :  - ",
    hre.ethers.formatEther(balance)
  );

  console.log("\n");

  console.log(
    "balance of owner after withdrawal : - ",
    await getBalance(owner.address)
  );

  console.log("\n");
  console.log("====MEMOS====");
  const memos = await buyCoffee.getMemos();
  await printMemos(memos);
}

main();
