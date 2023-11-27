import FormActivity from './form-activity';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { postActivity } from '~/services/api';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const formData = await request.formData();
  let { _action, ...values } = Object.fromEntries(formData);

  if (_action === 'createActivity')
    await postActivity(parseInt(params.shiftId), values, {
      request,
      response,
    });

  return redirect(`/shift/${params.shiftId}`, { headers: response.headers });
};

const AddActionPage = () => {
  return (
    <div className="justify-start mt-8 container">
      <FormActivity />
    </div>
  );
};

export default AddActionPage;
