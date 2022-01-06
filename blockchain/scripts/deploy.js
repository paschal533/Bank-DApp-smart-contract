const fs = require('fs');
async function main(){
    const BankContract = await ethers.getContractFactory("Bank");
    const bank = await BankContract.deploy();
    await bank.deployed();
    console.log("theBank contract was deployed to:" + bank.address);

    const tokenContract = await ethers.getContractFactory("Token");
    token = await tokenContract.deploy(bank.address);
    await token.deployed();
    console.log("the Tokencontract was deployed to:" + token.address);

    let addressess = {"bankcontract" : bank.address, "tokencontract" : token.address};
    let addressessJSON = JSON.stringify(addressess);
    fs.writeFileSync("environment/contract-address.json", addressessJSON);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })
