import { PlusCircledIcon } from '@radix-ui/react-icons';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import FormActivity from '~/components/form-activity';
import FormWarning from '~/components/from-warning';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
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
    <div className="container pt-8">
      <div className="flex justify-between">
        <h1>{formateDate(new Date(shift.created_at))}</h1>
        <div className="flex gap-x-4">
          <Dialog>
            <DialogTrigger>
              <Button size={'icon'}>
                <PlusCircledIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="activity" className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="warning">Warning</TabsTrigger>
                </TabsList>
                <TabsContent value="activity">
                  <FormActivity />
                </TabsContent>
                <TabsContent value="warning">
                  <FormWarning />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button variant={'outline'}>Tasks</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="activity" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="warning">Warning</TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          Make changes to your Activity here.
        </TabsContent>
        <TabsContent value="warning">Change your Warning here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftDetailsPage;
