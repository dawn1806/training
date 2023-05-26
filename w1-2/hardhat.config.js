require("@nomicfoundation/hardhat-toolbox");

let dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const mnemonic = process.env.MNEMONIC;
const scankey = process.env.SCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    mumbai: {
      url: "https://endpoints.omniatech.io/v1/matic/mumbai/public",
      accounts: {
        mnemonic: mnemonic,
      },
      chainId: 80001,
    },
  },

  etherscan: {
    apiKey: scankey,
  },
};
