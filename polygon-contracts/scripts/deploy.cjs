const hre = require("hardhat");

async function main() {
  await hre.run("compile");
  const ethers = hre.ethers;
  const TicketNFT = await ethers.getContractFactory("TicketNFT"); 
  const ticketNFT = await TicketNFT.deploy();

  await ticketNFT.deployed();
  console.log(`Contract deployed at: ${ticketNFT.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
