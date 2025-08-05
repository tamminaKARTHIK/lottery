"use client";

import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider, Network } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { NETWORK } from "@/constants/constants";
import { useToast } from "@/hooks/use-toast";
// Internal constants

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{ network: NETWORK as Network }}
      optInWallets={["Continue with Google","Petra","Nightly","Pontem Wallet", "Mizu Wallet"]}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
