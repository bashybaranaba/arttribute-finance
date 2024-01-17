const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArttributeFacilitator", function () {
  let arttributeFacilitator;
  let ghoToken;
  let owner;
  let user1;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, user1, addr1] = await ethers.getSigners();

    const GhoToken = await ethers.getContractFactory("GhoToken");
    ghoToken = await GhoToken.deploy(owner.address);
    await ghoToken.waitForDeployment();
    const ghoTokenAddress = await ghoToken.getAddress();

    const ArttributeFacilitator = await ethers.getContractFactory(
      "ArttributeFacilitator"
    );
    arttributeFacilitator = await ArttributeFacilitator.deploy(ghoTokenAddress);
    await arttributeFacilitator.waitForDeployment();
    const arttributeFacilitatorAddress =
      await arttributeFacilitator.getAddress();

    // Grant necessary roles
    const MINTER_ROLE = await arttributeFacilitator.MINTER_ROLE();
    await arttributeFacilitator.grantRole(MINTER_ROLE, owner.address);

    const VALUATOR_ROLE = await arttributeFacilitator.VALUATOR_ROLE();
    await arttributeFacilitator.grantRole(VALUATOR_ROLE, owner.address);

    // Add this after deploying the GhoToken and before deploying ArttributeFacilitator
    const largeEnoughCapacity = 1000000;
    const FACILITATOR_MANAGER_ROLE = await ghoToken.FACILITATOR_MANAGER_ROLE();
    await ghoToken.grantRole(FACILITATOR_MANAGER_ROLE, owner.address);
    await ghoToken.addFacilitator(
      arttributeFacilitatorAddress,
      "OwnerFacilitator",
      largeEnoughCapacity
    );
  });

  it("should mint tokens", async function () {
    const id = 1;
    const amount = 100;
    await arttributeFacilitator.mint(user1.address, id, amount, "0x00");
    expect(await arttributeFacilitator.balanceOf(user1.address, id)).to.equal(
      amount
    );
  });

  it("should set and check collateral correctly", async function () {
    const tokenId = 1;
    const tokenAmount = 5;
    const baseValue = 1;
    await arttributeFacilitator
      .connect(owner)
      .mint(addr1.address, tokenId, tokenAmount, "0x00");
    await arttributeFacilitator
      .connect(owner)
      .setModelBaseValue(tokenId, baseValue);

    // Set collateral
    await arttributeFacilitator
      .connect(addr1)
      .setCollateral(tokenId, tokenAmount, true);
    expect(await arttributeFacilitator.isCollateralized(tokenId, addr1.address))
      .to.be.true;

    // Check GhoToken balance (assuming 1:1 ratio for simplicity)
    expect(await ghoToken.balanceOf(addr1.address)).to.equal(tokenAmount);

    // Remove collateral
    await arttributeFacilitator
      .connect(addr1)
      .setCollateral(tokenId, tokenAmount, false);
    expect(await arttributeFacilitator.isCollateralized(tokenId, addr1.address))
      .to.be.false;
  });

  it("should return correct collateralization status", async function () {
    const tokenId = 1;
    const tokenAmount = 50;

    await arttributeFacilitator.mint(
      owner.address,
      tokenId,
      tokenAmount,
      "0x00"
    );
    //value model base value
    await arttributeFacilitator.connect(owner).setModelBaseValue(tokenId, 1);

    // Initially, it should not be collateralized
    expect(
      await arttributeFacilitator.isCollateralized(tokenId, owner.address)
    ).to.equal(false);

    // Set collateral
    await arttributeFacilitator
      .connect(owner)
      .setCollateral(tokenId, tokenAmount, true);

    // Now, it should be collateralized
    expect(
      await arttributeFacilitator.isCollateralized(tokenId, owner.address)
    ).to.equal(true);
  });

  it("should manage model base values correctly", async function () {
    const tokenId = 1;
    const baseValue = 1;
    await arttributeFacilitator
      .connect(owner)
      .setModelBaseValue(tokenId, baseValue);
    let currentBaseValue = await arttributeFacilitator.getModelBaseValue(
      tokenId
    );
    expect(currentBaseValue).to.equal(baseValue);

    let newBaseValue = 2;
    await arttributeFacilitator
      .connect(owner)
      .updateModelBaseValue(tokenId, newBaseValue);
    currentBaseValue = await arttributeFacilitator.getModelBaseValue(tokenId);
    expect(currentBaseValue).to.equal(newBaseValue);
  });

  it("should transfer ownership fraction correctly", async function () {
    const tokenId = 1;
    const tokenAmount = 100;

    await arttributeFacilitator.mint(
      owner.address,
      tokenId,
      tokenAmount,
      "0x00"
    );

    // Transfer half of the ownership
    const transferAmount = 50;
    await arttributeFacilitator
      .connect(owner)
      .transferOwnershipFraction(
        owner.address,
        user1.address,
        tokenId,
        transferAmount
      );

    // Verify balances after transfer
    expect(
      await arttributeFacilitator.balanceOf(owner.address, tokenId)
    ).to.equal(tokenAmount - transferAmount);
    expect(
      await arttributeFacilitator.balanceOf(user1.address, tokenId)
    ).to.equal(transferAmount);
  });
});
