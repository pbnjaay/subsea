import { json, type ActionFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { endShift } from '~/services/api';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  await endShift(parseInt(params.shiftId), { request, response });
  return json({}, { headers: response.headers });
};
