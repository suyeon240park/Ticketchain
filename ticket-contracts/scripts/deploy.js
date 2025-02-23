async function main() {
  const [deployer] = await ethers.getSigners();  // Get deployer address

  // Constructor arguments
  const name = "TicketNFT";
  const symbol = "TKT";
  const initialOwner = deployer.address;

  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  console.log("Deploying TicketNFT...");

  const ticketNFT = await TicketNFT.deploy(name, symbol, initialOwner); // Pass constructor args
  await ticketNFT.waitForDeployment();

  console.log("TicketNFT deployed to:", await ticketNFT.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
