const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("5")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2MockAddress, subscriptionId
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2MockContract = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2MockAddress = vrfCoordinatorV2MockContract.address

        // we also need subscriptionId on local network. So we need to create new subscription and we have to fund the new subId.
        // create a new Sub
        const txnResponse = await vrfCoordinatorV2MockContract.createSubscription()
        const txnReceipt = await txnResponse.wait(1)
        subscriptionId = txnReceipt.events[0].args.subId

        //Fund the subscription
        await vrfCoordinatorV2MockContract.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2MockAddress = networkConfig[chainId]["vrfCoordinatorV2"]
        //on testnests we dont need to create sub id programmatically-we can use the UI provided by chainlink
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"]
    const interval = networkConfig[chainId]["interval"]

    const args = [
        vrfCoordinatorV2MockAddress,
        entranceFee,
        gasLane,
        subscriptionId,
        callBackGasLimit,
        interval,
    ]
    const raffleContract = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //contract verififcation only on testnets but not localchains.
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("verifying contract on etherscan...")
        await verify(raffleContract.address, args)
    }
    log("---------------------------------")
}

module.exports.tags = ["all", "raffle"]
