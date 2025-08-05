import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getWinner = async (lottery_id: number | undefined): Promise<string> => {
  try {
    const rewards = await aptosClient().view<[string]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::get_winner`,
        functionArguments: [lottery_id],
      },
    });

    return rewards[0];
  } catch (error: any) {
    return "";
  }
};
