import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getIsLotteryDrawn = async (lottery_id: number | undefined): Promise<boolean> => {
  try {
    const rewards = await aptosClient().view<[boolean]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::is_lottery_drawn`,
        functionArguments: [lottery_id],
      },
    });

    return rewards[0];
  } catch (error: any) {
    return false;
  }
};
