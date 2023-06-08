require("@nomicfoundation/hardhat-toolbox");

let dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const mnemonic = process.env.MNEMONIC;
const dawn303 = process.env.DAWN303;
const scankey = process.env.SCAN_KEY_MUMBAI;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",

  networks: {
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/2uHAQ2unQ_WMGIpJlUlpLChckA-nj3As",
      accounts: {
        mnemonic: mnemonic, // 助记词可以推导出多个账户
        // path: "m/44'/60'/0'/0",
      },
      chainId: 80001,
    },

    bscTest: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545/",
      accounts: {
        mnemonic: mnemonic, // 助记词可以推导出多个账户
      },
      chainId: 97,
    },
  },

  etherscan: {
    apiKey: scankey,
  },
};
