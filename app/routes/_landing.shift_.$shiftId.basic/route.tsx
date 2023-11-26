import { json, type ActionFunctionArgs } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { toogleBasic } from '~/services/api';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.shiftId, 'Missing contactId param');
  const response = new Response();
  const formData = await request.formData();
  const { basic } = Object.fromEntries(formData);

  await toogleBasic(
    parseInt(params.shiftId),
    basic === 'false' ? false : true,
    {
      request,
      response,
    }
  );
  return json({}, { headers: response.headers });
};
