const { developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");


module.exports = async({ getNamedAccounts, deployments }) => {
    const { deploy, log , get} = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    const { networkConfig } = require("../helper-hardhat-config");
    

    let ethUSDPriceFeedAddress;
    if(developmentChains.includes(network.name)){
        const ethUSDAggregator = await get("MockV3Aggregator");
        ethUSDPriceFeedAddress = ethUSDAggregator.address;
    }
    else{
        ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
    }
    
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUSDPriceFeedAddress],
        log: true,
    })

    const { verify } = require("../utils/verify")

    if(!developmentChains.includes(network.name)){
        await verify(fundMe.address, [ethUSDPriceFeedAddress])
    }

}

module.exports.tags = ["all", "fundme"];