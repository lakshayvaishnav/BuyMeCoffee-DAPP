const hre = require("hardhat");
const abi = require("../artifacts/contracts/Coffee.sol/Coffee.json");

async function getBalance(provider, address) {
  const balance = await provider.getBalance(address);
  return hre.ethers.formatEther(balance);
}

async function main() {
  // get the contract details.
  const contractAddress = "0x89a2C9521abaf31443B133d22e5Aff188Ae720dd";
  const contractAbi = abi.abi;

  // get the api provider
  const provider = new hre.ethers.AlchemyProvider(
    "sepolia",
    process.env.SEPOLIA_API_KEY
  );

  // signer is used to sign the contracts.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const signerAddress = signer.address;
  console.log(signerAddress);
  if (!signerAddress) {
    console.error("Signer address is undefined or null.");
    return;
  }

  // connecting to contract.
  // signer is required to change the data in the contract.
  const buyCoffee = new hre.ethers.Contract(
    contractAddress,
    contractAbi,
    signer
  );

  console.log(
    `current balance of owner = ${await getBalance(
      provider,
      signerAddress
    )} ETH`
  );

  // checking the balacnce of contract
  console.log("--------------------------------------");
  console.log(
    `contract balance ${await getBalance(provider, buyCoffee.target)}`
  );

  const contractBalance = await getBalance(provider, buyCoffee.target);
  // instantiate a withdrawal function
  if (contractBalance != hre.ethers.formatEther(0)) {
    console.log("wait transaction is being perofmed...");
    const coffeeTxn = await buyCoffee.withdrawFunds();
    await coffeeTxn.wait();
  } else {
    console.log("no funds to withdraw...");
  }

  // Check ending balance.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, signerAddress),
    "ETH"
  );
}
main();
