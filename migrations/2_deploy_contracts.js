const Semcoin = artifacts.require("Semcoin");
const Sembank = artifacts.require("Sembank");

module.exports = function (deployer) {
    deployer.then(async () => {
        await deployer.deploy(Semcoin);

        const semcoinInstance = await Semcoin.deployed();
        const semcoinAddress = semcoinInstance.address;

        await deployer.deploy(Sembank, semcoinAddress);

        const sembankInstance = await Sembank.deployed();
        const sembankAddress = sembankInstance.address;

        await semcoinInstance.setBank(sembankAddress);

    });


}