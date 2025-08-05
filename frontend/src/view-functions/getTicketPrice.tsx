import { MODULE_ADDRESS } from "@/constants/constants";
import { aptosClient } from "@/utils/aptosClient";

export const getTicketPrice = async (): Promise<number> => {
  try {
    const ticketPrice = await aptosClient().view<[number]>({
      payload: {
        function: `${MODULE_ADDRESS}::lottery::get_ticket_price`,
        functionArguments: [],
      },
    });

    return ticketPrice[0];
  } catch (error: any) {
    return 0;
  }
};
