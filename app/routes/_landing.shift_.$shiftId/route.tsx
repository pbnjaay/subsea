import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData, useNavigate, useNavigation } from '@remix-run/react';
import invariant from 'tiny-invariant';
import Action from '~/components/action';
import { Button } from '~/components/ui/button';
import {
  deleteActivity,
  deleteWarning,
  getActivities,
  getShift,
  getWarningPoints,
} from '~/services/api';
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

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing contactId param');
  const response = new Response();
  const formData = await request.formData();
  const { _action, id } = Object.fromEntries(formData);

  if (_action === 'deleteActivity') {
    await deleteActivity(Number(id), { request, response });
  }

  if (_action === 'deleteWarning') {
    await deleteWarning(Number(id), { request, response });
  }

  return json({}, { headers: response.headers });
};

const ShiftDetailsPage = () => {
  const { shift, activities, warningPoints } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const navigation = useNavigation();

  if (!shift) return;
  return (
    <div className="container pt-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {formateDate(new Date(shift.created_at))}
        </h1>
        <div className="flex gap-x-4">
          <Button onClick={() => navigate(`/shift/${shift.id}/addaction`)}>
            Add Action
          </Button>
        </div>
      </div>
      <Action activities={activities} warnings={warningPoints} />
    </div>
  );
};

export default ShiftDetailsPage;
