"use client"

import { ChevronDown, Copy, LogOut, User } from "lucide-react";
import { useCallback, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export function WalletSelector() {
  const { account, connected, disconnect, wallet } = useWallet();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const copyAddress = useCallback(async () => {
    if (!account?.address) return;
    try {
      await navigator.clipboard.writeText(account.address);
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{account?.ansName || account?.address?.slice(0, 6) + "..." + account?.address?.slice(-4) || "Unknown"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={copyAddress} className="gap-2">
          <Copy className="h-4 w-4" /> Copy address
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={disconnect} className="gap-2">
          <LogOut className="h-4 w-4" /> Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Connect a Wallet</Button>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
}

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets } = useWallet();

  // Filter wallets by their readiness state
  const installedWallets = wallets.filter(wallet => wallet.ready);
  const notInstalledWallets = wallets.filter(wallet => !wallet.ready);

  return (
    <DialogContent className="max-h-screen overflow-auto font-primary">
      <DialogHeader>
        <DialogTitle className="flex flex-col text-center leading-snug">
          Connect Wallet
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-3 pt-3">
        {installedWallets.map((wallet) => (
          <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
        ))}
        
        {notInstalledWallets.length > 0 && (
          <Collapsible className="flex flex-col gap-3">
            <CollapsibleTrigger asChild>
              <Button size="sm" variant="ghost" className="gap-2">
                More wallets <ChevronDown />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-3">
              {notInstalledWallets.map((wallet) => (
                <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: any;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md font-primary">
      <div className="flex items-center gap-4">
        <img src={wallet.icon} alt={wallet.name} className="h-6 w-6" />
        <span className="text-base font-normal">{wallet.name}</span>
      </div>
      <Button 
        size="sm" 
        className="bg-[#e5ffad] hover:bg-[#e5ffad]/90 text-black rounded-full"
        onClick={() => {
          wallet.connect();
          onConnect?.();
        }}
      >
        {wallet.ready ? "Connect" : "Install"}
      </Button>
    </div>
  );
}
