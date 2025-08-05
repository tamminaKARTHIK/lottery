import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getLastLotteryId = async (): Promise<number> => {
  try {
    const lastLotteryId = await aptosClient().view<[number]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::get_last_lottery_id`,
        functionArguments: [],
      },
    });

    return lastLotteryId[0];
  } catch (error: any) {
    return 0;
  }
};
