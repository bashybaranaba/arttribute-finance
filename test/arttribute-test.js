const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArttributeFinance", function () {
  let arttributeFinance;
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

    const ArttributeFinance = await ethers.getContractFactory(
      "ArttributeFinance"
    );
    arttributeFinance = await ArttributeFinance.deploy(ghoTokenAddress);
    await arttributeFinance.waitForDeployment();
    const arttributeFinanceAddress = await arttributeFinance.getAddress();

    // Grant necessary roles
    const MINTER_ROLE = await arttributeFinance.MINTER_ROLE();
    await arttributeFinance.grantRole(MINTER_ROLE, owner.address);

    const VALUATOR_ROLE = await arttributeFinance.VALUATOR_ROLE();
    await arttributeFinance.grantRole(VALUATOR_ROLE, owner.address);

    // Add this after deploying the GhoToken and before deploying ArttributeFinance
    const largeEnoughCapacity = 1000000;
    const FACILITATOR_MANAGER_ROLE = await ghoToken.FACILITATOR_MANAGER_ROLE();
    await ghoToken.grantRole(FACILITATOR_MANAGER_ROLE, owner.address);
    await ghoToken.addFacilitator(
      arttributeFinanceAddress,
      "OwnerFacilitator",
      largeEnoughCapacity
    );
  });

  it("should mint tokens", async function () {
    const id = 1;
    const amount = 100;
    await arttributeFinance.mint(user1.address, id, amount, "0x00");
    expect(await arttributeFinance.balanceOf(user1.address, id)).to.equal(
      amount
    );
  });

  it("should set and check collateral correctly", async function () {
    const tokenId = 1;
    const tokenAmount = 5;
    const baseValue = 1;
    await arttributeFinance
      .connect(owner)
      .mint(addr1.address, tokenId, tokenAmount, "0x00");
    await arttributeFinance
      .connect(owner)
      .setModelBaseValue(tokenId, baseValue);

    // Set collateral
    await arttributeFinance
      .connect(addr1)
      .setCollateral(tokenId, tokenAmount, true);
    expect(await arttributeFinance.isCollateralized(tokenId, addr1.address)).to
      .be.true;

    // Check GhoToken balance (assuming 1:1 ratio for simplicity)
    expect(await ghoToken.balanceOf(addr1.address)).to.equal(tokenAmount);
  });

  it("should return correct collateralization status", async function () {
    const tokenId = 1;
    const tokenAmount = 50;

    await arttributeFinance.mint(owner.address, tokenId, tokenAmount, "0x00");
    //value model base value
    await arttributeFinance.connect(owner).setModelBaseValue(tokenId, 1);

    // Initially, it should not be collateralized
    expect(
      await arttributeFinance.isCollateralized(tokenId, owner.address)
    ).to.equal(false);

    // Set collateral
    await arttributeFinance
      .connect(owner)
      .setCollateral(tokenId, tokenAmount, true);

    // Now, it should be collateralized
    expect(
      await arttributeFinance.isCollateralized(tokenId, owner.address)
    ).to.equal(true);
  });

  it("should manage model base values correctly", async function () {
    const tokenId = 1;
    const baseValue = 1;
    await arttributeFinance
      .connect(owner)
      .setModelBaseValue(tokenId, baseValue);
    let currentBaseValue = await arttributeFinance.getModelBaseValue(tokenId);
    expect(currentBaseValue).to.equal(baseValue);

    let newBaseValue = 2;
    await arttributeFinance
      .connect(owner)
      .updateModelBaseValue(tokenId, newBaseValue);
    currentBaseValue = await arttributeFinance.getModelBaseValue(tokenId);
    expect(currentBaseValue).to.equal(newBaseValue);
  });

  it("should transfer ownership fraction correctly", async function () {
    const tokenId = 1;
    const tokenAmount = 100;

    await arttributeFinance.mint(owner.address, tokenId, tokenAmount, "0x00");

    // Transfer half of the ownership
    const transferAmount = 50;
    await arttributeFinance
      .connect(owner)
      .transferOwnershipFraction(
        owner.address,
        user1.address,
        tokenId,
        transferAmount
      );

    // Verify balances after transfer
    expect(await arttributeFinance.balanceOf(owner.address, tokenId)).to.equal(
      tokenAmount - transferAmount
    );
    expect(await arttributeFinance.balanceOf(user1.address, tokenId)).to.equal(
      transferAmount
    );
  });
});
