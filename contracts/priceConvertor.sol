// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {

    function getPrice(AggregatorV3Interface pricefeed) internal view returns(uint256) {
        
        (,int256 price,,,) = pricefeed.latestRoundData();
        return uint256(price * 1e10);
    
    }

    function getVersion(AggregatorV3Interface pricefeed) internal view returns(uint256) {
        return pricefeed.version();
    
    }

    function getConversionRate(uint256 _eth, AggregatorV3Interface pricefeed) internal view returns(uint256) {
        
        return (getPrice(pricefeed) * _eth) / 1e18 ;
    
    }
} 