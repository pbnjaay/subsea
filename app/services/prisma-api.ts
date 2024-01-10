import { $Enums } from '@prisma/client';
import prisma from 'client.server';

export const getActcvityBySateCount = async (state: $Enums.State) => {
  return await prisma.activity.count({ where: { state: state } });
};

export const getRecentIssues = async () => {
  return prisma.activity.findMany({
    take: 5,
    include: {
      Shift: { include: { supervisor: { include: { profile: true } } } },
    },
  });
};
