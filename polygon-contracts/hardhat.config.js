require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: process.env.POLYGON_RPC_URL,
      accounts: process.env.WALLET_PRIVATE_KEY,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};