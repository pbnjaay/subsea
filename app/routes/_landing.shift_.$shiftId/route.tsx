import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { getActivities, getShift, getWarningPoints } from '~/services/api';
import { formateDate } from '~/services/utils';

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
  const { shift, activities } = useLoaderData<typeof loader>();
  return (
    <div className="container mt-8 space-y-3">
      <h1 className="font-semibold text-2xl">
        Shift from {formateDate(new Date(shift?.created_at))}
      </h1>
      <Tabs defaultValue="activities" className="flex flex-col">
        <TabsList className="self-center">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="warnings">Warnings</TabsTrigger>
        </TabsList>
        <TabsContent value="activities">Display activities here</TabsContent>
        <TabsContent value="warnings">
          Display incident and warning here
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftDetailsPage;
