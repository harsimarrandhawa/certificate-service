async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const CertificateRegistry = await ethers.getContractFactory("CertificateService");
    const certificateRegistry = await CertificateRegistry.deploy();

    console.log("CertificateService address:", certificateRegistry.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
