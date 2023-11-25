import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import FormActivity from './form-activity';
import FormWarning from './form-warning';
import { ActionFunctionArgs, redirect } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { postActivity, postWarning } from '~/services/api';

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

  if (_action === 'createWarning')
    await postWarning(parseInt(params.shiftId), values, {
      request,
      response,
    });

  return redirect(`/shift/${params.shiftId}`, { headers: response.headers });
};

const AddActionPage = () => {
  return (
    <div className="mt-8 container">
      <Tabs defaultValue="activity" className="w-1/2">
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
    </div>
  );
};

export default AddActionPage;
