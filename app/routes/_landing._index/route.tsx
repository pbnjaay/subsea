import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
  CircleIcon,
  ArrowRight,
  XCircleIcon,
  ParenthesesIcon,
} from 'lucide-react';
import CardStat from '~/components/card-stat';
import Chart from '~/components/chart';
import Last5Activities from '~/components/last-activities';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { $Enums } from '@prisma/client';
import { getActcvityBySateCount, getRecentIssues } from '~/services/prisma-api';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard' },
    { name: 'description', content: 'Welcome to subsea app!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const openShiftsCount = await getActcvityBySateCount($Enums.State.OPEN);
  const inProgressShiftsCount = await getActcvityBySateCount(
    $Enums.State.IN_PROGRESS
  );
  const closedShiftsCount = await getActcvityBySateCount($Enums.State.CLOSED);

  const recentIssues = await getRecentIssues();

  interface RecentIssue {}

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

export default function Index() {
  const {
    openShiftsCount,
    inProgressShiftsCount,
    closedShiftsCount,
    recentIssues,
  } = useLoaderData<typeof loader>();
  const total = openShiftsCount + inProgressShiftsCount + closedShiftsCount;
  const options = [
    {
      label: 'Total',
      count: total,
      icon: <ParenthesesIcon className="w-4 h-4" />,
    },

    {
      label: 'Ouvert',
      count: openShiftsCount,
      icon: <CircleIcon className="w-4 h-4" />,
    },
    {
      label: 'En cours',
      count: inProgressShiftsCount,
      icon: <ArrowRight className="w-4 h-4" />,
    },
    {
      label: 'Fermé',
      count: closedShiftsCount,
      icon: <XCircleIcon className="w-4 h-4" />,
    },
  ];

  const data = [
    {
      name: 'Ouvert',
      count: openShiftsCount,
    },
    {
      name: 'En cours',
      count: inProgressShiftsCount,
    },
    {
      name: 'Fermé',
      count: closedShiftsCount,
    },
  ];

  return (
    <div className="container mt-8 flex flex-col space-y-4">
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-4">
        {options.map((option, i) => (
          <CardStat key={i} option={option} />
        ))}
      </div>
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart data={data}></Chart>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Last5Activities recentIssues={recentIssues}></Last5Activities>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
