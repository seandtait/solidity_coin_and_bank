// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Semcoin is ERC20 {
    address public bank;

    constructor() ERC20("Semcoin", "SMC") {}

    function setBank(address _bank) public {
        require(bank == address(0), "Bank already set");
        bank = _bank;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == bank, "Only the bank can mint tokens");
        _mint(to, amount);
    }
}
