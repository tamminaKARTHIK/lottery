import { MODULE_ADDRESS } from "@/constants/constants";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type CreateLotteryArguments = {
  durationInSeconds: number; // the duration of the lottery in seconds
};

/**
 * Create a lottery
 */
export const createLottery = (args: CreateLotteryArguments): InputTransactionData => {
  const {  durationInSeconds } = args;
  return {
    data: {
      function: `${MODULE_ADDRESS}::lottery::createLottery`,
      functionArguments: [durationInSeconds],
    },
  };
};
