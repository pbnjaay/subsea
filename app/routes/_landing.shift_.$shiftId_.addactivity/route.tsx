import FormActivity from './form-activity';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import prisma from 'client.server';

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  const response = new Response();
  const formData = await request.formData();
  let { _action, description, ...values } = Object.fromEntries(formData);

  if (_action === 'createActivity')
    await prisma.activity.create({
      data: {
        description: String(description),
        shiftId: Number(params.shiftId),
        ...values,
      },
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
