// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface ISemcoin {
    function mint(address to, uint256 amount) external;
}

contract Sembank {
    // The address of the contract owner
    address owner;

    function isOwner() public view returns (bool) {
        return owner == msg.sender;
    }

    // The contract address of Semcoin
    address public semcoinAddress;

    // The interface of Semcoin
    ISemcoin isemcoin;

    // The value of eth taken from deposits as a fee
    uint256 public feePot = 0;

    // The total pool of eth for users trading out of semcoin and back to eth.
    uint256 public ethPool = 0;

    // Tokens per eth
    uint256 public constant tokensPerEth = 10000;

    // What % of deposits goes to the feePot
    uint256 public constant depositFeePercentage = 5;

    // Events
    event Deposited(address indexed account, uint256 amount);
    event Withdrawn(address indexed account, uint256 amount);

    constructor(address _semcoinAddress) {
        semcoinAddress = _semcoinAddress;
        isemcoin = ISemcoin(semcoinAddress);
        owner = msg.sender;
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        uint256 fee = (msg.value * depositFeePercentage) / 100;
        feePot += fee;

        uint256 depositValue = msg.value - fee;
        ethPool += depositValue;

        uint256 tokenAmount = (depositValue * tokensPerEth) / 1 ether;
        isemcoin.mint(msg.sender, tokenAmount);
        emit Deposited(msg.sender, depositValue);
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdrawal amount must be greater than 0.");

        uint256 ethAmount = (amount * 1 ether) / tokensPerEth;
        require(
            ethAmount <= ethPool,
            "Insufficient eth in pool. Please contact admin."
        );

        require(
            IERC20(semcoinAddress).transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "Could not return tokens."
        );

        ethPool -= ethAmount;

        payable(msg.sender).transfer(ethAmount);

        emit Withdrawn(msg.sender, ethAmount);
    }

    function withdrawFeePot() public payable {
        require(msg.sender == owner, "Can only be withdrawn by the owner.");
        payable(msg.sender).transfer(feePot);
        feePot = 0;
    }
}
