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
import CardStat from '~/components/card-stat';
import { $Enums, Activity } from '@prisma/client';

const Action = ({ activities }: { activities: Activity[] | undefined }) => {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const getActivityTypeCount = (type: $Enums.Type) => {
    let count = 0;
    activities?.map((activity) => {
      if (activity.type === type) count += 1;
    });

    return count;
  };

  const options = [
    {
      label: 'Call ID',
      count: getActivityTypeCount('CALL_ID'),
      icon: <PhoneIncoming className="w-4 h-4" />,
    },
    {
      label: 'Plainte',
      count: getActivityTypeCount('PLAINTE'),
      icon: <ScrollText className="w-4 h-4" />,
    },
    {
      label: 'Incident',
      count: getActivityTypeCount('INCIDENT'),
      icon: <BugIcon className="w-4 h-4" />,
    },
    {
      label: 'Signal',
      count: getActivityTypeCount('SIGNALISATION'),
      icon: <ActivityIcon className="w-4 h-4" />,
    },
    {
      label: 'Autre',
      count: getActivityTypeCount('OTHER'),
      icon: <CircleEllipsis className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
      <div className="grid grid-cols-2 gap-2 md:gap-4 md:w-1/3 h-fit">
        {options.map((option, i) => (
          <CardStat option={option} key={i} />
        ))}
      </div>
      <div className="flex gap-y-4 flex-grow">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Activités</CardTitle>
            <CardDescription>Rapport d'activités</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              {activities?.map((activity, i) => (
                <div
                  key={i}
                  className={`group relative flex items-center justify-between p-4 hover:bg-muted rounded-sm cursor-point ${
                    Number(fetcher.formData?.get('id')) === activity.id
                      ? 'opacity-50 transition-opdacity'
                      : 'opacity-100 transition-opdacity'
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-semibold leading-none capitalize">
                      {activity.system}
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant={'outline'} className="capitalize">
                        {activity.type}
                      </Badge>
                      <Badge variant={'outline'} className="capitalize">
                        {activity.state}
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute md:group-hover:flex md:hidden h-fit right-0">
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
                              name="activityId"
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
