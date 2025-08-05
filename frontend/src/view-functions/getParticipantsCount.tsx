import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getParticipantsCount = async (lottery_id: number | undefined): Promise<number> => {
  try {
    const rewards = await aptosClient().view<[number]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::get_participants_count`,
        functionArguments: [lottery_id],
      },
    });

    return rewards[0];
  } catch (error: any) {
    return 0;
  }
};
