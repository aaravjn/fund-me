const networkConfig = {
    5: {
        name: "goerli",
        ethUSDPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
    }
};

const developmentChains = [
    "hardhat",
    "localhost",
]

const DECIMALS = 8;
const INITIAL_ANSWER = 100000000000;

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
};

