const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Existing contract addresses you gave me earlier
  const PLATFORM_TOKEN = "0x95c2b74E498f49Cb645B4eeA4295FDC7b4B64e36";
  const TOKEN_A = "0x9296B831e0E757d41D903a71559650Eeb74ff8E7";
  const TOKEN_B = "0x1bbB7b296F578b0EDFCf3b1e0b8313DEC3e68803";

  // 1. Deploy MultiTokenDEX
  console.log("Deploying MultiTokenDEX...");
  const MultiTokenDEX = await hre.ethers.getContractFactory("MultiTokenDEX");
  // Adjust constructor arguments if your DEX requires them, otherwise pass empty/configured ones
  const dex = await MultiTokenDEX.deploy(); 
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("🚀 MultiTokenDEX deployed to:", dexAddress);

  // 2. Deploy NFT Collection
  console.log("Deploying NFTCollection...");
  const NFTCollection = await hre.ethers.getContractFactory("NFTCollection");
  const nftCollection = await NFTCollection.deploy();
  await nftCollection.waitForDeployment();
  const nftCollectionAddress = await nftCollection.getAddress();
  console.log("🚀 NFTCollection deployed to:", nftCollectionAddress);

  // 3. Deploy NFT Marketplace
  console.log("Deploying NFTMarketplace...");
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(
    nftCollectionAddress,
    PLATFORM_TOKEN,
    dexAddress
  );
  await nftMarketplace.waitForDeployment();
  const marketplaceAddress = await nftMarketplace.getAddress();
  console.log("🚀 NFTMarketplace deployed to:", marketplaceAddress);

  console.log("\n--- All Done! Update your addresses.ts with these values ---");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});