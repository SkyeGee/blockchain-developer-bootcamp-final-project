
const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners(); //get the account to deploy the contract

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const EtherCoinToss = await hre.ethers.getContractFactory("EtherCoinToss"); //getting the contract
  const etherCoinToss = await EtherCoinToss.deploy(); //deploying the contract

  await etherCoinToss.deployed(); //waiting for the contract to be deployed

  console.log("EtherCoinToss deployed to:", etherCoinToss.address); // Returning the contract address on the rinkeby network
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); //calling the function to deploy the contract