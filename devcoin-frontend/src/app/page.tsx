'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Wallet, ArrowUpRight, Coins, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// 1. TODO: Replace with your actual deployed contract address from Sepolia Remix
// ✅ This is the corrected, verified address copied straight from your Remix deployment logs
const CONTRACT_ADDRESS = "0x9466955bD2E6aC91264872B3F434D5e9E03164ed";

// 2. Strongly typed minimum ERC-20 ABI requirements
const TOKEN_ABI: string[] = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function symbol() view returns (string)"
];

interface StatusLog {
  type: 'info' | 'success' | 'error' | '';
  text: string;
}

export default function Home() {
  const [account, setAccount] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [tokenSymbol, setTokenSymbol] = useState<string>('DVC');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusLog>({ type: '', text: '' });

  // Update token metric data concurrently
  const updateWalletData = async (provider: ethers.BrowserProvider, userAddress: string): Promise<void> => {
    console.group("🔍 Web3 Debug: updateWalletData Initialized");
    console.log("🔹 TARGET CONTRACT ADDRESS:", CONTRACT_ADDRESS);
    console.log("🔹 USER SIGNER ADDRESS:", userAddress);

    try {
      // Diagnostic 1: Verify the provided contract address format is valid
      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        throw new Error(`The CONTRACT_ADDRESS format "${CONTRACT_ADDRESS}" is invalid.`);
      }

      // Diagnostic 2: Check for bytecode on the active network
      console.log("📡 Fetching on-chain bytecode from network...");
      const code = await provider.getCode(CONTRACT_ADDRESS);
      console.log("📦 Bytecode result returned:", code);
      
      if (code === "0x" || code === "0x0") {
        console.warn("⚠️ CRITICAL: Deployed code is empty (0x). This means your MetaMask network does not match where this contract was deployed!");
        setStatus({ type: 'error', text: 'Token not found on this network. Please switch MetaMask networks.' });
        console.groupEnd();
        return;
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TOKEN_ABI, signer);
      
      console.log("🚀 Executing concurrent Promise.all for balanceOf and symbol...");
      const [rawBalance, symbol] = await Promise.all([
        contract.balanceOf(userAddress),
        contract.symbol()
      ]);
      
      console.log("✅ RAW BALANCE (wei):", rawBalance.toString());
      console.log("✅ DETECTED SYMBOL:", symbol);

      setBalance(ethers.formatUnits(rawBalance, 18));
      setTokenSymbol(symbol);
    } catch (err: any) {
      console.error("❌ ERROR DIED IN updateWalletData LAYER:", err);
      console.error("❌ ERROR CODE DETAILS:", err.code);
      console.error("❌ ERROR METADATA VALUE:", err.value);
      setStatus({ type: 'error', text: `Contract runtime read error: ${err.message || err}` });
    } finally {
      console.groupEnd();
    }
  };

  const getEthereumObject = () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      return (window as any).ethereum;
    }
    return null;
  };

  // Connect Web3 Provider Account
  const connectWallet = async (): Promise<void> => {
    console.group("🔌 Web3 Debug: connectWallet Executed");
    const ethereum = getEthereumObject();
    
    if (!ethereum) {
      console.error("❌ MetaMask injector window.ethereum is undefined.");
      alert("Web3 Wallet core interface missing. Please install MetaMask browser extension.");
      console.groupEnd();
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', text: 'Requesting permission to access your cryptographic identity...' });
      
      const provider = new ethers.BrowserProvider(ethereum);
      
      // Diagnostic 3: Inspect active provider connection target details
      const network = await provider.getNetwork();
      console.log("🌐 CURRENT METAMASK NETWORK METRICS:", {
        name: network.name,
        chainId: network.chainId.toString()
      });

      const accounts: string[] = await provider.send("eth_requestAccounts", []);
      const userAddress = accounts[0];
      console.log("🔐 LOGGED ACCOUNT SIGNATURE:", userAddress);
      
      setAccount(userAddress);
      await updateWalletData(provider, userAddress);
      setStatus({ type: 'success', text: 'Identity successfully authenticated.' });
    } catch (error: any) {
      console.error("❌ ERROR DURING AUTHENTICATION:", error);
      setStatus({ type: 'error', text: 'User rejected authentication or connection failed.' });
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  // Handle On-Chain Token Transfer Action
  const handleTransfer = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.group("💸 Web3 Debug: handleTransfer Initiated");
    
    const ethereum = getEthereumObject();
    const cleanRecipient = recipient.trim();
    
    console.log("🔹 INPUT RECIPIENT ADDRESS:", cleanRecipient);
    console.log("🔹 INPUT AMOUNT:", amount);

    if (!cleanRecipient || !amount || !ethereum) {
      console.error("❌ Forms input submission is empty or provider missing.");
      console.groupEnd();
      return;
    }

    try {
      setLoading(true);
      setStatus({ type: 'info', text: 'Building payload... Requesting hardware/extension signature...' });

      if (!ethers.isAddress(cleanRecipient)) {
        console.error(`❌ INVALID FORMAT: Target address "${cleanRecipient}" failed EVM hex syntax evaluation.`);
        setStatus({ type: 'error', text: 'Invalid address format entered. Must be a 42-character hex string.' });
        console.groupEnd();
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, TOKEN_ABI, signer);

      const parsedAmount = ethers.parseUnits(amount, 18);
      console.log("📡 Encoded Transfer Volume BigInt representation:", parsedAmount.toString());

      console.log("✍️ Dispatching payload signature window request to MetaMask...");
      const tx = await contract.transfer(cleanRecipient, parsedAmount);
      
      console.log("🚀 TRANSACTION BROADCAST SUCCESSFUL:", tx);
      setStatus({ type: 'info', text: `Broadcast successful. Awaiting block settlement: ${tx.hash.substring(0, 14)}...` });
      
      console.log("⏳ Awaiting network mining tracking confirm block receipts...");
      const receipt = await tx.wait();
      console.log("🧾 TRANSACTION MINED RECEIPT STATUS:", receipt);
      
      setStatus({ type: 'success', text: 'Asset safely transferred and written to immutable ledger.' });
      setAmount('');
      setRecipient('');
      await updateWalletData(provider, account);
    } catch (error: any) {
      console.error("❌ TRANSACTION RUNTIME REJECTION ESCALATED:", error);
      setStatus({ type: 'error', text: 'Transaction dropped or manually cancelled by client.' });
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 relative">
        <header className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <Coins className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            ERC-20 DevConsole
          </h1>
          <p className="text-xs text-slate-500 mt-1">TypeScript Debug Mode Active</p>
        </header>

        {!account ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-slate-100 hover:bg-white text-slate-950 font-semibold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-white/5 active:scale-[0.99] disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            {loading ? 'Authorizing Context...' : 'Initialize Web3 Connection'}
          </button>
        ) : (
          <div className="space-y-5">
            <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block mb-1">
                Connected Signer Wallet
              </label>
              <p className="font-mono text-xs text-indigo-300 break-all select-all selection:bg-indigo-500/30">
                {account}
              </p>
            </div>

            <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 flex justify-between items-center">
              <div>
                <label className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block mb-0.5">
                  Liquidity Balance
                </label>
                <p className="text-3xl font-bold text-emerald-400 tracking-tight font-mono">
                  {parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </p>
              </div>
              <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-sm">
                {tokenSymbol}
              </span>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 pt-4 border-t border-slate-800/80">
              <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block">
                Execute Transfer Protocol
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Target Ledger Account (0x...)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl pl-4 pr-4 py-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="Asset Volume Multiplier (Amount)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl pl-4 pr-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-2xl transition duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 text-xs"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                {loading ? 'Awaiting Finality Execution...' : 'Authorize Vault Dispatch'}
              </button>
            </form>
          </div>
        )}

        {status.text && (
          <div className={`mt-6 p-3 rounded-2xl border flex items-start gap-2 text-xs font-mono transition-all duration-200 ${
            status.type === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
            status.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
            'bg-slate-950/50 border-slate-800 text-slate-400'
          }`}>
            {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            {status.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
            {status.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 mt-0.5 animate-spin" />}
            <span className="break-all">{status.text}</span>
          </div>
        )}
      </div>
    </main>
  );
}