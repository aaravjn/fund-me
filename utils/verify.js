const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("verifying address")
    try{
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    }
    catch (error){
        if(error.message.toLowerCase().includes("already verified")) {
            console.log("The contract is already verified")
        }
        else{
            console.log(error)
        }
    }
}

module.exports = {
    verify
}