import { MODULE_ADDRESS } from "@/constants/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type buyLotteryTicketArguments = {
  lotteryId: number; // lottery id
};

/**
 * Buy a ticket for a lottery
 */
export const buyLotteryTicket = (args: buyLotteryTicketArguments): InputTransactionData => {
  const {  lotteryId } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::lottery::buyTicket`,
      functionArguments: [lotteryId],
    },
  };
};
