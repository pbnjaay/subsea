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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import CardStat from '~/components/card-stat';

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
      label: 'Call ID',
      count: getActivityTypeCount('call Id'),
      icon: <PhoneIncoming className="w-4 h-4" />,
    },
    {
      label: 'Plainte',
      count: getActivityTypeCount('plainte'),
      icon: <ScrollText className="w-4 h-4" />,
    },
    {
      label: 'Incident',
      count: getActivityTypeCount('incident'),
      icon: <BugIcon className="w-4 h-4" />,
    },
    {
      label: 'Signal',
      count: getActivityTypeCount('signalisation'),
      icon: <ActivityIcon className="w-4 h-4" />,
    },
    {
      label: 'Autre',
      count: getActivityTypeCount('autre'),
      icon: <CircleEllipsis className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex space-x-4">
      <div className="grid grid-cols-2 gap-4 w-1/3 h-fit">
        {options.map((option, i) => (
          <CardStat option={option} key={i} />
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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size={'icon'} variant={'ghost'}>
                          <TrashIcon className="w-4 h-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Êtes-vous absolument sûr ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action ne peut être annulée. Cette action
                            supprimera définitivement ces données de nos
                            serveurs.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Anuler</AlertDialogCancel>
                          <fetcher.Form method="delete">
                            <AlertDialogAction
                              type="submit"
                              name="_action"
                              value="deleteActivity"
                            >
                              Continuer
                            </AlertDialogAction>
                            <input
                              type="number"
                              hidden
                              defaultValue={activity.id}
                              name="id"
                            />
                          </fetcher.Form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
