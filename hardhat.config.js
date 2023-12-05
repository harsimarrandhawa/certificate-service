require("@nomicfoundation/hardhat-toolbox");
const INFURA_API_KEY = "b83ea3cf172f4db6a47194c28f9c746d";//TODO:make it more secure
const SEPOLIA_PRIVATE_KEY = "ca7d29e438c97b791d0bbadeb3f5345f887fc622fdccc179f8812d9c6a2f991b";//TODO:make it more secure
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
  	sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    hardhat: {
      chainId: 1337
    }
  }
};