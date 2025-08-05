import { MODULE_ADDRESS } from "@/constants/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type drawWinnersArguments = {
  lotteryId: number; // lottery id
};

/**
 * Buy a ticket for a lottery
 */
export const drawWinner = (args: drawWinnersArguments): InputTransactionData => {
  const {  lotteryId } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::lottery::draw_winner`,
      functionArguments: [lotteryId],
    },
  };
};
