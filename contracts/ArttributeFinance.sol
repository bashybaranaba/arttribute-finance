// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./GhoToken.sol"; // Import the GhoToken contract

contract ArttributeFinance is ERC1155, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant VALUATOR_ROLE = keccak256("VALUATOR_ROLE");

    
    GhoToken private ghoToken;

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Mapping from token ID to its total supply
    mapping(uint256 => uint256) private _totalSupply;

    // Mapping from token ID to mapping of owner address to collateral status
    mapping(uint256 => mapping(address => bool)) private _collateralStatus;

    //mapping to store the base value of each AI model in GHO tokens
    mapping(uint256 => uint256) private _modelBaseValueInGho;

    constructor(address ghoTokenAddress) ERC1155("https://api.example.com/token/") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        ghoToken = GhoToken(ghoTokenAddress);
    }

    //minting tokenized asset
    function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyRole(MINTER_ROLE) {
        _mint(account, id, amount, data);
        _totalSupply[id] += amount;
    }

    function setCollateral(uint256 id, uint256 amount, bool status) external {
        require(balanceOf(msg.sender, id) >= amount, "Insufficient token balance");
        require(_collateralStatus[id][msg.sender] != status, "Collateral status is already set");

        if (status) {
            // Lock tokens as collateral and mint GHO tokens
            _collateralStatus[id][msg.sender] = true;
            uint256 ghoAmount = calculateGhoAmount(id, amount);
            ghoToken.mint(msg.sender, ghoAmount);
        } else {
            // Unlock tokens from collateral and burn GHO tokens
            _collateralStatus[id][msg.sender] = false;
            uint256 ghoAmount = calculateGhoAmount(id, amount);
            ghoToken.burn(ghoAmount);
        }
    }

    function isCollateralized(uint256 id, address owner) public view returns (bool) {
        return _collateralStatus[id][owner];
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        return _totalSupply[id];
    }

    // Function to set the base value of the AI model in GHO tokens
    function calculateGhoAmount(uint256 id, uint256 amount) private view returns (uint256) {
        require(_modelBaseValueInGho[id] > 0, "Model not valued");

        // Calculate the value based on the base value of the model and the amount of fractional ownership
        uint256 valueInGho = _modelBaseValueInGho[id] * amount;
        return valueInGho;
    }

    function setModelBaseValue(uint256 id, uint256 valueInGho) public onlyRole(VALUATOR_ROLE) {
        _modelBaseValueInGho[id] = valueInGho;
    }

    function updateModelBaseValue(uint256 id, uint256 newValueInGho) public onlyRole(VALUATOR_ROLE) {
        require(_modelBaseValueInGho[id] > 0, "Model not valued");
        _modelBaseValueInGho[id] = newValueInGho;
    }

    function getModelBaseValue(uint256 id) public view returns (uint256) {
        return _modelBaseValueInGho[id];
    }

    // Function to transfer fractional ownership
    function transferOwnershipFraction(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) public {
        require(balanceOf(from, id) >= amount, "Insufficient balance to transfer");
        require(from != address(0) && to != address(0), "Invalid address");
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "Caller is not owner nor approved"
        );
        safeTransferFrom(from, to, id, amount, "");
    }
}
