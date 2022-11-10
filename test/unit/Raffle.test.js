const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit tests", async function () {
          let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer
          const chainId = network.config.chainId
          const sendValue = ethers.utils.parseEther("0.02") //1eth

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"]) // deploys all contracts inside deploy folder with tag "all"
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
              raffleEntranceFee = await raffle.getEntracnceFee()
          })

          describe("constructor", async function () {
              it("initializes the raffle correctly", async function () {
                  //ideally we make our tests have just 1 assert per "it"
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })

          describe("Enter Raffle", async function () {
              it("Should revert when you dont pay enough", async function () {
                  await expect(raffle.enterRaffle()).to.be.revertedWith(
                      "Raffle__NotEnoughETHEntered" //error mentioned in contract's fund() functions
                  )
              })
              it("records players when they enter", async function () {
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const player = await raffle.getPlayer(0)
                  console.log(player, deployer)
                  assert.equal(player, deployer)
              })

              it("emits event an event", async function () {
                  await expect(raffle.enterRaffle({ value: raffleEntranceFee })).to.emit(
                      raffle, //contract
                      "RaffleEnter" //event name
                  )
              })
          })
      })
