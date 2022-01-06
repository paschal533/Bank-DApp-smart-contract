const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank App", () => {

    let bank, token, owner, address_1, address_2;
    let addressess;

    beforeEach(async () => {
        const BankContract = await ethers.getContractFactory("Bank");
        bank = await BankContract.deploy();
        await bank.deployed()

        const tokenContract = await ethers.getContractFactory("Token");
        token = await tokenContract.deploy(bank.address);
        await token.deployed();

        [owner, address_1, address_2, ...addressess] = await ethers.getSigners();
    });

    describe("Deployment", () => {
        it("should be totalAssets Of 0", async () => {
            expect(await bank.totalAssets()).to.equal('0')
        });
        it("should have 0 token, and 0 deposit in owner account", async () => {
            expect(await bank.accounts(owner.address)).to.equal('0');
            expect(await token.balanceOf(owner.address)).to.equal("0");
        });
        it("should have 0 token, and 0 deposit in address_1 account", async () => {
            expect(await bank.accounts(address_1.address)).to.equal('0');
            expect(await token.balanceOf(address_1.address)).to.equal("0");
        });
        it("should have 0 token, and 0 deposit in address_2 account", async () => {
            expect(await bank.accounts(address_2.address)).to.equal('0');
            expect(await token.balanceOf(address_2.address)).to.equal("0");
        });
    });

    describe("Deposit and withdraw", () => {

        const oneether = ethers.utils.parseEther("1.0");

        it("should let owner deposit 1 ether", async () => {
            await bank.connect(authur).deposit({value: oneether});
            expect(await bank.totalAssets()).to.equal(oneether);
            expect(await bank.accounts(authur.address)).to.equal(oneether);
        });
        it("should let account_1 deposit", async () => {
            await bank.connect(address_1).deposit({value: oneether});
            await bank.connect(address_1).withdraw(oneether, token.address)
            expect(await bank.totalAssets()).to.equal('0');
            expect(await token.balanceOf(address_1.address)).to.equal(oneether);
        });
        it("should fail while trying to withdraw money you havent deposited", async () => {
            await expect(bank.connect(address_2).withdraw(oneether, token.address)).to.be.revertedWith("Cannot withdraw more than deposited");
        });
    });
});
