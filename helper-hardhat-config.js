const { ethers } = require("hardhat")

const networkConfig = {
    // 5 -> chainId of goerli
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "6346", //from : https://vrf.chain.link/
        callBackGasLimit: "5000000",
        interval: "30", // interval in sec to pick winner
    },
    31337: {
        //for local network we deploy new mock coordinator so address not needed here.
        name: "hardhat",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", //not needed on local,
        callBackGasLimit: "5000000",
        interval: "30",
    },
    137: {
        name: "polygon",
        vrfCoordinatorV2: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
        entranceFee: ethers.utils.parseEther("0.01"),
        gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93",
    },
}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITITAL_ANSWER = 200000000000

const frontEndContractsFile = "../nextjs-lottery-dapp/constants/contractAddresses.json"
const frontEndAbiFile = "../nextjs-lottery-dapp/constants/abi.json"

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITITAL_ANSWER,
    frontEndContractsFile,
    frontEndAbiFile,
}
