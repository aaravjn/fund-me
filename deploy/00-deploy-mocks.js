const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");
    const chainId = network.config.chainId
    
    log(`The deployer is ${deployer}`);

    if(developmentChains.includes(network.name) || chainId == 31337) {
        log("Local Network Detected, Deploying Mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
            waitConfirmations: network.config.blockConfirmations || 1,
        });
        log("Mocks Deployed");
    }
}

module.exports.tags = ["all", "mocks"];