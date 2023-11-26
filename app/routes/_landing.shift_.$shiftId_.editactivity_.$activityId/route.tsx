import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
import { Database } from 'db_types';
import { useState } from 'react';
import { Label } from 'recharts';
import invariant from 'tiny-invariant';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import {
  getActivity,
  getWarning,
  updateActivity,
  updateWarning,
} from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  invariant(params.activityId, 'Missing warningId param');

  const response = new Response();
  const activity = await getActivity(parseInt(params.activityId), {
    response,
    request,
  });

  return json({ activity }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.activityId, 'Missing warningId param');
  const formData = await request.formData();
  let { ...values } = Object.fromEntries(formData);

  const response = new Response();
  await updateActivity(parseInt(params.activityId), values, {
    request,
    response,
  });

  return redirect(`/shift/${params.shiftId}`, { headers: response.headers });
};

interface Activity {
  description: string | null;
  system: Database['public']['Enums']['system'];
  title: string | null;
  type: Database['public']['Enums']['activity_type'] | null;
}

const EditWarningPage = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { activity } = useLoaderData<typeof loader>();
  const [act, setAct] = useState<Activity>({
    description: activity.description,
    title: activity.title,
    system: activity.system,
    type: activity.type,
  });
  return (
    <div className="container mt-8">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Add new activity</CardTitle>
          <CardDescription>Create quickly a activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                type="text"
                required
                defaultValue={act.title as string}
                onChange={(ev) => setAct({ ...act, title: ev.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <Select
                name="system"
                required
                defaultValue={act.system}
                onValueChange={(value) => setAct({ ...act, system: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sat3">Sat3</SelectItem>
                  <SelectItem value="mainone">Mainone</SelectItem>
                  <SelectItem value="rafia">Rafia</SelectItem>
                  <SelectItem value="ace">Ace</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="type"
                required
                defaultValue={act.type as string}
                onValueChange={(value) => setAct({ ...act, type: value })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claim">Claim</SelectItem>
                  <SelectItem value="callID">Call ID</SelectItem>
                  <SelectItem value="instance">Instance</SelectItem>
                  <SelectItem value="other">Divers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                defaultValue={act.description as string}
                onChange={(ev) =>
                  setAct({ ...act, description: ev.target.value })
                }
              />
            </div>
            <div className="space-x-2">
              <Button
                disabled={navigation.state === 'submitting'}
                type="submit"
              >
                {navigation.state === 'submitting' ? 'submitting' : 'submit'}
              </Button>
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWarningPage;
