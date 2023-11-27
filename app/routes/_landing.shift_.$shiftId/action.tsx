import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  ActivityIcon,
  BugIcon,
  CircleEllipsis,
  EditIcon,
  PhoneIncoming,
  ScrollText,
  TrashIcon,
} from 'lucide-react';
import { useFetcher } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { useNavigate } from '@remix-run/react';
import { Database } from 'db_types';
import { Badge } from '~/components/ui/badge';

export interface Activity {
  created_at: string;
  title: string | null;
  description: string | null;
  id: number;
  shift: number | null;
  system: Database['public']['Enums']['system'];
  type: Database['public']['Enums']['type'];
  state: Database['public']['Enums']['state'];
}

const Action = ({ activities }: { activities: Activity[] | null }) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const getActivityTypeCount = (type: Database['public']['Enums']['type']) => {
    let count = 0;
    activities?.map((activity) => {
      if (activity.type === type) count += 1;
    });

    return count;
  };

  const options = [
    {
      title: 'Call ID',
      count: getActivityTypeCount('call Id'),
      icon: <PhoneIncoming className="w-4 h-4" />,
    },
    {
      title: 'Plainte',
      count: getActivityTypeCount('plainte'),
      icon: <ScrollText className="w-4 h-4" />,
    },
    {
      title: 'Incident',
      count: getActivityTypeCount('incident'),
      icon: <BugIcon className="w-4 h-4" />,
    },
    {
      title: 'Signal',
      count: getActivityTypeCount('signalisation'),
      icon: <ActivityIcon className="w-4 h-4" />,
    },
    {
      title: 'Autre',
      count: getActivityTypeCount('autre'),
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
            <CardTitle className="text-lg">Activités</CardTitle>
            <CardDescription>Liste des activités</CardDescription>
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
                      <Badge className="capitalize">{activity.state}</Badge>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Action;
