import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getShift } from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const shift = await getShift(parseInt(params.shiftId), { request, response });
  return json({ shift }, { headers: response.headers });
};

const ShiftDetailsPage = () => {
  const { shift } = useLoaderData<typeof loader>();
  <div>okkkkkkkkkkkkkk</div>;
  return <div>{JSON.stringify(shift)}</div>;
};

export default ShiftDetailsPage;
