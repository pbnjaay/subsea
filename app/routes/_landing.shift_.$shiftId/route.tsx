import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Badge } from '~/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Switch } from '~/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getActivities, getShift, getWarningPoints } from '~/services/api';
import { formatInstant, formateDate } from '~/services/utils';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const shift = await getShift(parseInt(params.shiftId), { request, response });
  const activities = await getActivities(params.shiftId, { request, response });
  const warningPoints = await getWarningPoints(params.shiftId, {
    request,
    response,
  });
  return json(
    { shift, activities, warningPoints },
    { headers: response.headers }
  );
};

const ShiftDetailsPage = () => {
  const { shift, activities, warningPoints } = useLoaderData<typeof loader>();
  console.log(activities);

  if (!shift) return;
  return (
    <div className="container mt-8 space-y-3">
      <h1 className="font-semibold text-2xl">
        {formateDate(new Date(shift?.created_at))}
      </h1>
      <div className="flex md:gap-x-4">
        <Card className=" w-2/3 py-3">
          <CardContent>
            <Tabs defaultValue="activities" className="flex flex-col">
              <TabsList className="self-start">
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="warnings">Warnings</TabsTrigger>
              </TabsList>
              <TabsContent value="activities">
                <h1 className="text-xl font-semibold mb-3">List of activity</h1>
                {activities?.map((activity) => (
                  <Card className="mb-4 pt-3">
                    <CardContent>
                      <div className="flex flex-col gap-y-1">
                        <p>{activity.description}</p>
                        <div className="space-x-2">
                          <Badge className="capitalize">{activity.type}</Badge>
                          <Badge className="capitalize">
                            {activity.system}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              <TabsContent value="warnings">
                {warningPoints?.length ? (
                  warningPoints?.map((warning) => (
                    <div>
                      {warning.type}
                      <p>{warning.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No warnings</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-y-4">
          <Card>
            <CardContent className="flex items-center gap-x-14 py-2">
              <div>
                <h1 className="font-semibold text-lg">Basic check</h1>
                <p className="text-muted-foreground text-sm">
                  Mark Basic as done or not
                </p>
              </div>
              <Form method="patch" action="">
                <button>
                  <Switch checked={shift.is_basic_done || false} />
                </button>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-x-14 py-2">
              <div>
                <h1 className="font-semibold text-lg">Alarm check</h1>
                <p className="text-muted-foreground text-sm">
                  Mark Alarm as checked or not
                </p>
              </div>
              <Form method="patch" action="">
                <button>
                  <Switch checked={shift.is_alarm_checked || false} />
                </button>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-x-14 py-2">
              <div>
                <h1 className="font-semibold text-lg">Room check</h1>
                <p className="text-muted-foreground text-sm">
                  Mark room visit as done or not
                </p>
              </div>
              <Form method="patch" action="">
                <button>
                  <Switch checked={shift.is_room_checked || false} />
                </button>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShiftDetailsPage;
