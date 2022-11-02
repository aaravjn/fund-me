const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")


! developmentChains,includes(network.name)
    ? describe.skip
    : describe("FundMe", async function (){
    
    let fundMe
    let contract_deployer
    let mockV3Aggregator

    beforeEach(async function () {
        contract_deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", contract_deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", contract_deployer)
    })
    
    describe("constructor", async function (){
        it("Sets the aggregator address correctly", async function (){
            const response = await fundMe.s_pricefeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("Fund", async function (){
        it("Revert if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.reverted
        })

        it("Updates the amountoAddress data structure", async () => {
            const amount = ethers.utils.parseEther("1")
            await fundMe.fund({value: amount})
            let response = await fundMe.s_addressToAmount(
                contract_deployer
            )
            assert.equal(response.toString(), amount.toString());
        })
        it("Adds the funders to the funders array", async () => {
            const amount = ethers.utils.parseEther("1")
            await fundMe.fund({value: amount})
            let response = await fundMe.s_funders(0)
            assert.equal(response.toString(), contract_deployer.toString())
        })
    })
    describe("Withdraw", async () => {
        beforeEach(async function() {
            await fundMe.fund({value: ethers.utils.parseEther("2")})
        })
        it("Withdraws the amount correctly", async () => {
            const startingfundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            
            const startingDeployerBalance = await fundMe.provider.getBalance(
                contract_deployer
            )
            
            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait(1)

            const endingfundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            
            const endingDeployerBalance = await fundMe.provider.getBalance(
                contract_deployer
            )

            const { gasUsed, effectiveGasPrice } = transactionReciept
            const gasCost = gasUsed.mul(effectiveGasPrice)

            assert.equal(endingfundMeBalance, 0)
            assert.equal(startingfundMeBalance.add(startingDeployerBalance).toString(), 
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        it("Allows to correctly withdraw funds from multiple funders", async () => {
            const accounts = await ethers.getSigners()
            for(let i = 0;i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({value: ethers.utils.parseEther("1")})
            }
            const startingfundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            
            const startingDeployerBalance = await fundMe.provider.getBalance(
                contract_deployer
            )
            const transactionResponse = await fundMe.withdraw()
            const transactionReciept = await transactionResponse.wait(1)

            const endingfundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            
            const endingDeployerBalance = await fundMe.provider.getBalance(
                contract_deployer
            )

            const { gasUsed, effectiveGasPrice } = transactionReciept
            const gasCost = gasUsed.mul(effectiveGasPrice)

            assert.equal(endingfundMeBalance, 0)
            assert.equal(startingfundMeBalance.add(startingDeployerBalance).toString(), 
                endingDeployerBalance.add(gasCost).toString()
            )

            await expect(fundMe.s_funders(0)).to.be.reverted
            for(let i = 0 ;i<6;i++){
                assert.equal(
                    await fundMe.s_addressToAmount(accounts[i].address), 0
                )
            }
        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(
                accounts[1]
            )
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.reverted
        })
    })
})