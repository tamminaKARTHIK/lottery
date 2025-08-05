"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createLottery } from "@/entry-functions/CreateLottery";
import { useToast } from "@/hooks/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { useQueryClient } from "@tanstack/react-query";

export function CreateLotteryForm() {
  const [duration, setDuration] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { signAndSubmitTransaction } = useWallet();
  const { toast } = useToast();

  const queryClient = useQueryClient();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration) {
      toast({
        description: "Please enter a valid duration",
        variant: "destructive",
      });
      return;
    }

    try {
      const durationInSeconds = parseInt(duration);
      const result = await signAndSubmitTransaction(
        createLottery({ durationInSeconds })
      );
      // Wait for the transaction to be commited to chain
      await aptosClient().waitForTransaction({
        transactionHash: result.hash,
      });
      queryClient.refetchQueries();
      toast({
        description: "Lottery created successfully!",
        variant: "success",
      });
      setIsOpen(false);
      setDuration("");
    } catch (error: any) {
      console.error("Error creating lottery:", error);
      toast({
        description: `Error creating lottery: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="primary" className="font-primary text-black">
          Create Lottery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-primary ">
            Create New Lottery
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 font-primary">
          <Card className="w-full max-w-md mx-auto">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (in seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Enter lottery duration"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-[#e5ffad] text-black hover:bg-[#e5ffad]/90"
                >
                  Create Lottery
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
