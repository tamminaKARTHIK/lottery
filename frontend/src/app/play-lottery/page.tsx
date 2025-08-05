"use client";

import React from "react";
import {
  AptosWalletAdapterProvider,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { Network, AptosClient, Types } from "aptos";
import { PetraWallet } from "petra-plugin-wallet-adapter";

// ✅ Set up wallets (Petra here)
const wallets = [new PetraWallet()];

// ✅ Create Aptos client for Testnet
const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");

// ✅ WalletSelector component (replaces broken import)
function WalletSelector() {
  const { wallets, connect, connected, account, disconnect } = useWallet();

  return (
    <div style={{ marginTop: "1rem" }}>
      {connected ? (
        <div>
          <p>✅ Connected: {account?.address}</p>
          <button onClick={disconnect} style={{ marginTop: "0.5rem" }}>
            Disconnect
          </button>
        </div>
      ) : (
        wallets.map((wallet) => (
          <button
            key={wallet.name}
            onClick={() => connect(wallet.name)}
            style={{ marginRight: "1rem", padding: "8px 16px" }}
          >
            Connect with {wallet.name}
          </button>
        ))
      )}
    </div>
  );
}

// ✅ Lottery action handler
function LotteryActions() {
  const { account, signAndSubmitTransaction } = useWallet();

  const handleBuyTicket = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const txn: Types.TransactionPayload = {
        type: "entry_function_payload",
        function: "0xYOUR_MODULE_ADDRESS::lottery::buy_ticket", // <-- Replace this
        type_arguments: [],
        arguments: [],
      };

      // ✅ Fix: wrap payload in { data }
      const response = await signAndSubmitTransaction({ data: txn });

      // ✅ Wait for confirmation
      await client.waitForTransaction(response.hash);

      alert("✅ Ticket purchased! Txn Hash: " + response.hash);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to buy ticket");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      {account && <p>Connected as: {account.address}</p>}
      <button onClick={handleBuyTicket} style={{ marginTop: "1rem", padding: "10px 20px" }}>
        🎟️ Buy Ticket
      </button>
    </div>
  );
}

// ✅ Main Page Component
export default function PlayLotteryPage() {
  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => console.log("Wallet error:", error)}
      // 🚫 'network' prop may not be needed in some versions
    >
      <main style={{ padding: "2rem", fontFamily: "Arial" }}>
        <h1>🎲 Aptos Lottery DApp</h1>
        <p>Connect your wallet to start playing.</p>
        <WalletSelector />
        <LotteryActions />
      </main>
    </AptosWalletAdapterProvider>
  );
}
