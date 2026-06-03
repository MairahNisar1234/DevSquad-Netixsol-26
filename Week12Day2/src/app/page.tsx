"use client";

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

// =========================
// CONTRACT CONFIG
// =========================
const CONTRACT_ADDRESS = "0x5F03b8a3e6E14DD871E10fD9824fe84523A62470";

const CONTRACT_ABI = [
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function mintNFT() payable",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function mintPrice() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

const SEPOLIA_RPC_URLS = [
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://rpc2.sepolia.org",
  "https://sepolia.drpc.org",
  "https://rpc.sepolia.org",
];

type NFTItem = {
  id: number;
  name: string;
  image: string;
  owner?: string;
};

// =========================
// HELPERS
// =========================

/** Resolves an RPC node that is alive and responsive */
async function getWorkingProvider(): Promise<ethers.JsonRpcProvider | null> {
  for (const url of SEPOLIA_RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(url);
      await provider.getBlockNumber();
      return provider;
    } catch {
      console.warn(`RPC failed: ${url}`);
    }
  }
  return null;
}

/** Robust URL formatter that enforces public gateways onto raw CIDs and cuts out local network loops */
function resolveURI(uri: string, gatewayBase = "https://cloudflare-ipfs.com/ipfs/"): string {
  if (!uri) return "";
  const clean = uri.trim();
  
  if (clean.startsWith("ipfs://")) {
    const path = clean.slice(7);
    return `${gatewayBase}${path}`;
  }
  
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    if (clean.includes("pinata.cloud/ipfs/")) {
      const segments = clean.split("pinata.cloud/ipfs/");
      if (segments[1]) return `${gatewayBase}${segments[1]}`;
    }
    return clean;
  }
  
  return `${gatewayBase}${clean}`;
}

/** Fetches the metadata file, automatically rotating gateways if one fails or rate-limits */
async function fetchMetadata(tokenId: number): Promise<{ name: string; image: string } | null> {
  const metadataGateways = [
    `https://gateway.pinata.cloud/ipfs/bafybeifdpdd2y44lmrtmrblp2pc444nlugduv3h5hmr5g5sylbe62j4ou4/${tokenId}.json`,
    `https://cloudflare-ipfs.com/ipfs/bafybeifdpdd2y44lmrtmrblp2pc444nlugduv3h5hmr5g5sylbe62j4ou4/${tokenId}.json`,
    `https://ipfs.io/ipfs/bafybeifdpdd2y44lmrtmrblp2pc444nlugduv3h5hmr5g5sylbe62j4ou4/${tokenId}.json`
  ];

  for (const url of metadataGateways) {
    try {
      const res = await fetch(url, { 
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000) 
      });
      
      if (!res.ok) continue; 
      
      const meta = await res.json();
      console.log(`Metadata Found for Token #${tokenId}:`, meta);

      const rawImageUri = meta.image || meta.image_url || "";
      
      return {
        name: meta.name || "",
        image: resolveURI(rawImageUri, "https://cloudflare-ipfs.com/ipfs/"),
      };
    } catch (err) {
      console.warn(`Gateway rate-limited or failed for token #${tokenId} on URL: ${url}. Trying next alternative...`);
    }
  }
  return null;
}

// =========================
// MAIN PAGE COMPONENT
// =========================
export default function MintPage() {
  const [status, setStatus] = useState("Connect wallet to mint NFT");
  const [statusColor, setStatusColor] = useState("text-emerald-400");
  const [currentSupply, setCurrentSupply] = useState("--");
  const [maxSupply, setMaxSupply] = useState("--");
  const [mintPrice, setMintPrice] = useState("0");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [allNFTs, setAllNFTs] = useState<NFTItem[]>([]); 
  const [walletNFTs, setWalletNFTs] = useState<NFTItem[]>([]); 
  const [galleryTab, setGalleryTab] = useState<"all" | "mine">("all");
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  const getEthereum = () =>
    typeof window !== "undefined" ? (window as any).ethereum ?? null : null;

  // =========================
  // CONTRACT HANDLERS
  // =========================
  const updateContractData = useCallback(async (contract: ethers.Contract) => {
    try {
      const [supply, max, price] = await Promise.all([
        contract.totalSupply(),
        contract.MAX_SUPPLY(),
        contract.mintPrice(),
      ]);
      setCurrentSupply(supply.toString());
      setMaxSupply(max.toString());
      setMintPrice(ethers.formatEther(price));
      return Number(supply);
    } catch (err) {
      console.error("updateContractData error:", err);
      setStatus("Could not read contract — check network/RPC");
      setStatusColor("text-red-400");
      return 0;
    }
  }, []);

  const fetchAllNFTs = useCallback(async (contract: ethers.Contract) => {
    setIsLoadingGallery(true);
    try {
      const supply = Number(await contract.totalSupply());
      if (supply === 0) { setAllNFTs([]); return; }

      let startId = 1;
      try {
        await contract.tokenURI(0);
        startId = 0; 
      } catch {
        startId = 1; 
      }

      const items: NFTItem[] = [];
      for (let id = startId; id < startId + supply; id++) {
        try {
          // Pacing delay so public nodes don't drop connections due to spam metrics
          await new Promise((resolve) => setTimeout(resolve, 120));
          
          const meta = await fetchMetadata(id);
          if (meta) {
            items.push({ id, name: meta.name || `NFT #${id}`, image: meta.image });
          }
        } catch {
          // Skip broken indices seamlessly
        }
      }
      setAllNFTs(items);
    } catch (err) {
      console.error("fetchAllNFTs error:", err);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);

  const fetchWalletNFTs = useCallback(
    async (contract: ethers.Contract, address: string) => {
      try {
        const balance = Number(await contract.balanceOf(address));
        if (balance === 0) { setWalletNFTs([]); return; }

        const items: NFTItem[] = [];
        for (let i = 0; i < balance; i++) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 120));

            const tokenId = Number(await contract.tokenOfOwnerByIndex(address, i));
            const meta = await fetchMetadata(tokenId);
            if (meta) {
              items.push({
                id: tokenId,
                name: meta.name || `NFT #${tokenId}`,
                image: meta.image,
                owner: address,
              });
            }
          } catch {
            // skip problematic token IDs
          }
        }
        setWalletNFTs(items);
      } catch {
        console.warn("tokenOfOwnerByIndex unavailable, scanning ownerOf fallbacks...");
        try {
          const owned = await Promise.all(
            allNFTs.map(async (nft) => {
              try {
                const owner: string = await contract.ownerOf(nft.id);
                return owner.toLowerCase() === address.toLowerCase() ? nft : null;
              } catch {
                return null;
              }
            })
          );
          setWalletNFTs(owned.filter(Boolean) as NFTItem[]);
        } catch (err) {
          console.error("ownerOf fallback assignment failed:", err);
        }
      }
    },
    [allNFTs]
  );

  // =========================
  // ACTIONS
  // =========================
  const connectWallet = async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setStatusColor("text-red-400");
      setStatus("MetaMask not detected");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      setIsWalletConnected(true);
      setStatus("Wallet connected ✓");
      setStatusColor("text-emerald-400");

      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      await updateContractData(contract);
      await fetchAllNFTs(contract);
      await fetchWalletNFTs(contract, address);

      setGalleryTab("mine");
    } catch (err) {
      setStatusColor("text-red-400");
      setStatus("Wallet connection failed");
      console.error(err);
    }
  };

  const mintNFT = async () => {
    const ethereum = getEthereum();
    if (!ethereum) return;
    try {
      setIsMinting(true);
      setStatusColor("text-emerald-400");
      setStatus("Waiting for wallet confirmation...");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const price = await contract.mintPrice();
      const tx = await contract.mintNFT({ value: price });

      setStatus("Transaction submitted — waiting for confirmation...");
      await tx.wait();

      setStatus("NFT minted successfully 🎉");

      const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      await updateContractData(readContract);
      await fetchAllNFTs(readContract);
      await fetchWalletNFTs(readContract, walletAddress);
    } catch (err: any) {
      console.error(err);
      setStatusColor("text-red-400");
      if (err?.code === "ACTION_REJECTED" || err?.code === 4001) {
        setStatus("Transaction rejected by user");
      } else {
        setStatus("Mint failed — see console for details");
      }
    } finally {
      setIsMinting(false);
    }
  };

  // =========================
  // INITIAL DATA MOUNTING
  // =========================
  useEffect(() => {
    const init = async () => {
      const provider = await getWorkingProvider();
      if (!provider) {
        setStatus("All RPC endpoints unavailable");
        setStatusColor("text-red-400");
        return;
      }
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      await updateContractData(contract);
      await fetchAllNFTs(contract);
    };
    init();
  }, [updateContractData, fetchAllNFTs]);

  const isSoldOut = currentSupply !== "--" && maxSupply !== "--" && currentSupply === maxSupply;
  const displayNFTs = galleryTab === "mine" ? walletNFTs : allNFTs;

  return (
    <main className="min-h-screen bg-slate-900 p-6 flex flex-col items-center">
      
      {/* MINT INTERFACE CARD */}
      <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-sky-400 text-center">Serenity Essence</h1>
        <p className="mt-2 text-center text-slate-400 text-sm">Mint your unique NFT artwork.</p>

        <div className="mt-6 text-center text-slate-200 text-lg font-semibold">
          Minted: <span className="text-sky-400">{currentSupply}</span> / {maxSupply}
        </div>
        <div className="mt-1 text-center text-slate-400 text-sm">
          Mint Price: {mintPrice} ETH
        </div>

        <div className="mt-6">
          {!isWalletConnected ? (
            <button
              onClick={connectWallet}
              className="w-full rounded-xl bg-sky-600 py-3 text-white font-semibold hover:bg-sky-500 transition"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={mintNFT}
              disabled={isMinting || isSoldOut}
              className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMinting ? "Minting…" : isSoldOut ? "Sold Out" : "Mint NFT"}
            </button>
          )}
        </div>

        {isWalletConnected && (
          <p className="mt-3 text-center text-xs text-slate-500 font-mono">
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          </p>
        )}

        <div className={`mt-4 rounded-xl bg-slate-950 p-3 text-sm text-center font-mono ${statusColor}`}>
          {status}
        </div>
      </div>

      {/* GALLERY INTERFACE */}
      {(allNFTs.length > 0 || isLoadingGallery) && (
        <div className="mt-12 w-full max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-slate-200">Gallery</h2>

          {isWalletConnected && (
            <div className="flex justify-center gap-2 mb-6">
              {(["all", "mine"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setGalleryTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    galleryTab === tab ? "bg-sky-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {tab === "all" ? `All NFTs (${allNFTs.length})` : `My NFTs (${walletNFTs.length})`}
                </button>
              ))}
            </div>
          )}

          {isLoadingGallery ? (
            <p className="text-center text-slate-400 text-sm animate-pulse">Loading NFTs…</p>
          ) : displayNFTs.length === 0 ? (
            <p className="text-center text-slate-500 text-sm">
              {galleryTab === "mine" ? "No NFTs found in this wallet." : "No NFTs minted yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayNFTs.map((nft) => (
                <div key={nft.id} className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shadow-lg flex flex-col">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="h-72 w-full object-cover bg-slate-950"
                    onError={(e) => {
                      const currentSrc = (e.target as HTMLImageElement).src;
                      if (currentSrc.includes("cloudflare-ipfs.com")) {
                        (e.target as HTMLImageElement).src = currentSrc.replace("cloudflare-ipfs.com", "ipfs.io");
                      } else if (currentSrc.includes("ipfs.io")) {
                        (e.target as HTMLImageElement).src = currentSrc.replace("ipfs.io", "gateway.pinata.cloud");
                      } else {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/1e293b/94a3b8?text=Image+Unavailable";
                      }
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-base font-bold text-slate-200 truncate">{nft.name}</h3>
                    <p className="mt-1 text-xs text-slate-400 font-mono">Token #{nft.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}