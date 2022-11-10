const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium. IT costs 0.25 Link for exectution.
const GAS_PRICE_LINK = 1e9 //1000000000 //link per gas. Calculated value based on the gas price

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    
    if (developmentChains.includes(network.name)) {
        log("Local networr detected! Deploying mocks...")
        //deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        })
        log("Mocks deployed")
        log("--------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]