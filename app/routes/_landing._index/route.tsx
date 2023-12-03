import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Database } from 'db_types';
import {
  PhoneIncoming,
  ScrollText,
  BugIcon,
  CircleIcon,
  ArrowRight,
  XCircleIcon,
  ParenthesesIcon,
} from 'lucide-react';
import { DataKey } from 'recharts/types/util/types';
import CardStat from '~/components/card-stat';
import Chart from '~/components/chart';
import Last5Activities from '~/components/last-activities';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  getActivityStateCount,
  getRecentIssues,
  getShifts,
} from '~/services/api';
import { Profile } from '../_landing/header';

export interface RecentActivity {
  created_at: string;
  description: string | null;
  id: number;
  shift:
    | (number & {
        created_at: string;
        end_at: string | null;
        id: number;
        is_alarm_checked: boolean | null;
        is_basic_done: boolean | null;
        is_room_checked: boolean | null;
        supervisor: string | null;
        profiles: Profile | null;
      })
    | null;
  state: Database['public']['Enums']['state'];
  system: Database['public']['Enums']['system'];
  title: string;
  type: Database['public']['Enums']['type'];
}

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const openShiftsCount = await getActivityStateCount(
    { request, response },
    'open'
  );
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
    <div className="container mt-8 flex flex-col md:space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-4">
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
