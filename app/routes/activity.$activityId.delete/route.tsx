import { LoaderFunctionArgs, json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { deleteActivity, deleteShift } from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log('ooooooo');

  invariant(params.activityId, 'activityId shiftId param');
  const response = new Response();
  await deleteActivity(parseInt(params.activityId), {
    request,
    response,
  });
  return json({}, { headers: response.headers });
};
