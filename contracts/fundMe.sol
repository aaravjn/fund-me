// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./priceConvertor.sol";

/** @title This is a crowd funding contract
  * @author Aarav Jain
  * @notice This contract is to demo a sample funding contract
  * @dev This implements Price Feeds as our library
 */
contract FundMe {
    using PriceConvertor for uint256;

    uint256 public minimumUSD = 50;
    
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmount;

    address public immutable i_owner;

    AggregatorV3Interface public s_pricefeed;
    
    constructor(address pricefeedAddress) {
        i_owner = msg.sender;
        s_pricefeed = AggregatorV3Interface(pricefeedAddress);
    }

    function fund() public payable {
        
        require(msg.value.getConversionRate(s_pricefeed) >= minimumUSD, "Didn't pay enough USD");
        s_funders.push(msg.sender);
        s_addressToAmount[msg.sender] += msg.value;
    }
    
    function withdraw() public onlyOwner{
        address[] memory funders = s_funders;
        for(uint256 i = 0; i < funders.length; i++){
            address funder = funders[i];
            s_addressToAmount[funder] = 0;
        }

        s_funders = new address[](0);
        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner {

        require(msg.sender == i_owner, "Sender is not owner");
        _;
    }
}