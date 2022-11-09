const { assert } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name) ? 
    describe.skip
    : describe("FundMe", async function () {
        let fundMe
        let deployer
        const sendValue = ethers.utils.parseEthers("1")
        beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer) 
        })
        it("allows people to fund and owner to also withdraw", async function () {
            const accounts = await getNamedAccounts()
            const funder = fundMe.connect(
                accounts[1]
            )
            await funder.fund({value: sendValue})
            const endingBalance = await ethers.providers.getBalance(fundMe.address)
            assert.equal(endingBalance.toString(), sendValue.toString())
        })
    })