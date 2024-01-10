import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { getActivityStateCount, getRecentIssues } from '~/services/api';
import { $Enums } from '@prisma/client';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const openShiftsCount = getActivityStateCount($Enums.State.OPEN);
  const inProgressShiftsCount = await getActivityStateCount(
    { request, response },
    'in progress'
  );

  const closedShiftsCount = await getActivityStateCount(
    { request, response },
    'closed'
  );

  const recentIssues = await getRecentIssues({ request, response });

  return json(
    {
      openShiftsCount,
      inProgressShiftsCount,
      closedShiftsCount,
      recentIssues,
    },
    { headers: response.headers }
  );
};
