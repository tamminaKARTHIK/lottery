"use client";

import React, { useState, useEffect } from 'react';
import { getLastLotteryId } from '@/view-functions/getLastLotteryId';
import { getIsLotteryDrawn } from '@/view-functions/getIsLotteryDrawn';
import LotteryCard from '@/components/LotteryCard';

interface LotteryListProps {
  status: 'new' | 'ended';
}

const LotteryList: React.FC<LotteryListProps> = ({ status }) => {
  const [lotteries, setLotteries] = useState<number[]>([]);

  useEffect(() => {
    const fetchLotteries = async () => {
      const lastLotteryId = await getLastLotteryId();
      const allLotteryIds = Array.from({ length: lastLotteryId }, (_, i) => i + 1);

      const filteredLotteries = await Promise.all(
        allLotteryIds.map(async (id) => {
          const isDrawn = await getIsLotteryDrawn(id);
          return { id, isDrawn };
        })
      );

      const filteredIds = filteredLotteries
        .filter(lottery => status === 'new' ? !lottery.isDrawn : lottery.isDrawn)
        .map(lottery => lottery.id);

      setLotteries(filteredIds);
    };

    fetchLotteries();
  }, [status]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lotteries.map(lotteryId => (
        <LotteryCard key={lotteryId} lotteryId={lotteryId} />
      ))}
    </div>
  );
};

export default LotteryList;