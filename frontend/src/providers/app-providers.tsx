"use client";

import React, { useState, PropsWithChildren } from "react";

import {
  QueryClientProvider,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import { WalletProvider } from "./wallet-provider";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ClientOnly from "@/components/ClientOnly";

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <ClientOnly>
            {children}
            <WrongNetworkAlert />
            <Toaster />
          </ClientOnly>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
