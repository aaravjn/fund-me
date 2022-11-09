import { ethers } from "./ethers-es6.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const getBalanceButton = document.getElementById("getBalance")
const withdrawButton = document.getElementById("withdrawBalance")

fundButton.onclick = fund
connectButton.onclick = connect
getBalanceButton.onclick = getBalance
withdrawButton.onclick = withdraw_balance

async function connect(){
    if(typeof window.ethereum !== "undefined"){
        await window.ethereum.request({method: "eth_requestAccounts"})
        connectButton.innerHTML = "Connected!"
    }
    else{
        connectButton.innerHTML = "No metamask"
    }
}

async function fund(){
    let ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with: ${ethAmount}`)
    
    if(typeof window.ethereum !== "undefined"){

    }
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    console.log(signer)
    const contract = new ethers.Contract(contractAddress, abi, signer)
    let transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
    await ListenforTxMined(transactionResponse, provider)
}

function ListenforTxMined(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReciept) => {
            console.log(
            `Transaction Confirmed with ${transactionReciept.confirmations} confirmations`
            )
            resolve()
        })
    }) 
}

async function getBalance(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
}

async function withdraw_balance() {
    if(typeof window.ethereum !== "undefined"){
        console.log("Withdrawing.....")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await ListenforTxMined(transactionResponse, provider)
        }
        catch (error){
            console.log(error)
        }
    }
}