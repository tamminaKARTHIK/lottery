import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getLotteryEndTime = async (lottery_id: number | undefined): Promise<number> => {
  try {
    const endtime = await aptosClient().view<[number]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::get_lottery_end_time`,
        functionArguments: [lottery_id],
      },
    });

    return endtime[0];
  } catch (error: any) {
    return 0;
  }
};
