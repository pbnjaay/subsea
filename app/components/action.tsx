import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  ActivityIcon,
  BugIcon,
  CircleEllipsis,
  CircleOff,
  EditIcon,
  PhoneIncoming,
  ScrollText,
  ShieldAlert,
  TrashIcon,
} from 'lucide-react';
import { useFetcher } from 'react-router-dom';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNavigate } from '@remix-run/react';

interface Activity {
  created_at: string;
  title: string | null;
  description: string | null;
  id: number;
  shift: number | null;
  system: 'sat3' | 'mainone' | 'rafia' | 'ace';
  type: 'claim' | 'callID' | 'instance' | 'other' | null;
}
[];

interface Warning {
  created_at: string;
  description: string | null;
  end_date: string | null;
  id: number;
  shift: number | null;
  state: 'open' | 'in progress' | 'closed' | null;
  system: 'sat3' | 'mainone' | 'rafia' | 'ace' | null;
  title: string | null;
  type: 'signalisation' | 'incident' | null;
}
[];

const Action = ({
  activities,
  warnings,
}: {
  activities: Activity[] | null;
  warnings: Warning[] | null;
}) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const getActivityTypeCount = (type: string) => {
    let count = 0;
    activities?.map((activity) => {
      if (activity.type === type) count += 1;
    });

    return count;
  };

  const getWarningTypeCount = (type: string) => {
    let count = 0;
    warnings?.map((warning) => {
      if (warning.type === type) count += 1;
    });

    return count;
  };

  const options = [
    {
      title: 'Call ID',
      count: getActivityTypeCount('callID'),
      icon: <PhoneIncoming className="w-4 h-4" />,
    },
    {
      title: 'Instance',
      count: getActivityTypeCount('instance'),
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      title: 'Claim',
      count: getActivityTypeCount('claim'),
      icon: <ScrollText className="w-4 h-4" />,
    },
    {
      title: 'Incident',
      count: getWarningTypeCount('incident'),
      icon: <BugIcon className="w-4 h-4" />,
    },
    {
      title: 'Signal',
      count: getWarningTypeCount('signalisation'),
      icon: <ActivityIcon className="w-4 h-4" />,
    },
    {
      title: 'Other',
      count: getActivityTypeCount('other'),
      icon: <CircleEllipsis className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex space-x-4">
      <div className="grid grid-cols-2 gap-4 w-1/3 h-fit">
        {options.map((option, i) => (
          <Card className="w-full px-6 py-4 space-y-2" key={i}>
            <div className="flex justify-between items-center">
              <h1 className="font-bold text-2xl">{option.count}</h1>
              <span className="flex items-center justify-center rounded-full w-8 h-8 bg-muted">
                {option.icon}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-muted-foreground">
              {option.title}
            </h2>
          </Card>
        ))}
      </div>
      <div className="flex gap-y-4 flex-grow">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
            <CardDescription>List of actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {activities?.map((activity, i) => (
                <div
                  key={i}
                  className={`group flex items-center justify-between p-4 hover:bg-muted rounded-sm cursor-point ${
                    Number(fetcher.formData?.get('id')) === activity.id
                      ? 'opacity-50 transition-opdacity'
                      : 'opacity-100 transition-opdacity'
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none">
                      {activity.title}
                    </p>
                    <div className="flex space-x-2">
                      <Badge className="capitalize">{activity.type}</Badge>
                      <Badge className="capitalize">{activity.system}</Badge>
                    </div>
                  </div>
                  <div className="group-hover:flex gap-x-2 hidden">
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                      type="submit"
                      onClick={() => navigate(`editactivity/${activity.id}`)}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <fetcher.Form method="delete">
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        type="submit"
                        name="_action"
                        value="deleteActivity"
                      >
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </Button>
                      <input
                        type="number"
                        hidden
                        defaultValue={activity.id}
                        name="id"
                      />
                    </fetcher.Form>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              {warnings?.map((warning, i) => (
                <div
                  key={i}
                  className={`group flex items-center justify-between p-4 hover:bg-muted rounded-sm cursor-pointer ${
                    Number(fetcher.formData?.get('id')) === warning.id
                      ? 'opacity-50 transition-opdacity'
                      : 'opacity-100 transition-opdacity'
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none">
                      {warning.title}
                    </p>
                    <div className="flex space-x-2">
                      <Badge className="capitalize">{warning.type}</Badge>
                      <Badge className="capitalize">{warning.system}</Badge>
                      <Badge className="capitalize">{warning.state}</Badge>
                    </div>
                  </div>
                  <div className="group-hover:flex gap-x-2 hidden">
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                      type="submit"
                      onClick={() => navigate(`editwarning/${warning.id}`)}
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <fetcher.Form method="delete">
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        type="submit"
                        name="_action"
                        value="deleteWarning"
                      >
                        <input
                          type="number"
                          hidden
                          defaultValue={warning.id}
                          name="id"
                        />
                        <TrashIcon className="w-4 h-4 text-red-600" />
                      </Button>
                    </fetcher.Form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Action;
