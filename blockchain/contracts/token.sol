pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address private bankContract;

    modifier onlyBank() {
        require(msg.sender == bankContract, "only the bank can mint new tokens");
        _;
    }

    constructor(address _bankAddress) ERC20("Yield Token", "FREE") {
        bankContract = _bankAddress;
    }

    function mint(address t0, uint256 amount) public onlyBank {
        _mint(t0, amount);
    }
}
