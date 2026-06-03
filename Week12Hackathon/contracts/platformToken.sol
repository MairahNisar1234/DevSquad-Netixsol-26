// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlatformToken is ERC20, Ownable {

    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    // authorized minters (faucet, future contracts)
    mapping(address => bool) public minters;

    constructor() 
        ERC20("PlatformCoin", "PLC") 
        Ownable(msg.sender) 
    {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // owner can allow faucet or other contracts to mint
    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
    }

    // mint function used by faucet
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender], "Not authorized minter");
        _mint(to, amount);
    }
}