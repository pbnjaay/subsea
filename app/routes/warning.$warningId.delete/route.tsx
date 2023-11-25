import { LoaderFunctionArgs, json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { deleteWarning } from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log('ooooooo');

  invariant(params.warningId, 'activityId shiftId param');
  const response = new Response();
  await deleteWarning(parseInt(params.warningId), {
    request,
    response,
  });
  return json({}, { headers: response.headers });
};
