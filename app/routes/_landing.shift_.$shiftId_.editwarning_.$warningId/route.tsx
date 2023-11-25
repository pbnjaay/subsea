import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';
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
import { getWarning, updateWarning } from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  invariant(params.warningId, 'Missing warningId param');

  const response = new Response();
  const warning = await getWarning(parseInt(params.warningId), {
    response,
    request,
  });

  return json({ warning }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.warningId, 'Missing warningId param');
  const formData = await request.formData();
  let { ...values } = Object.fromEntries(formData);

  const response = new Response();
  await updateWarning(parseInt(params.warningId), values, {
    request,
    response,
  });

  return redirect(`/shift/${params.shiftId}`, { headers: response.headers });
};

interface Warning {
  description: string | null;
  state: 'open' | 'in progress' | 'closed' | null;
  system: 'sat3' | 'mainone' | 'rafia' | 'ace' | null;
  title: string | null;
  type: 'signalisation' | 'incident' | null;
}

const EditWarningPage = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { warning } = useLoaderData<typeof loader>();
  const [warn, setWarn] = useState<Warning>({
    description: warning.description,
    title: warning.title,
    state: warning.state,
    system: warning.system,
    type: warning.type,
  });
  return (
    <div className="container mt-8">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Edit warning</CardTitle>
          <CardDescription>Edit quickly a warning</CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="patch">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                type="text"
                required
                defaultValue={warn?.title as string}
                onChange={(ev) => setWarn({ ...warn, title: ev.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <Select
                name="system"
                required
                defaultValue={warn?.system as string}
                onValueChange={(value: 'sat3' | 'mainone' | 'rafia' | 'ace') =>
                  setWarn({ ...warn, system: value })
                }
              >
                <SelectTrigger>
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
                defaultValue={warn?.type as string}
                onValueChange={(value) => setWarn({ ...warn, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signalisation">Signalisation</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="state"
                required
                defaultValue={warn?.state as string}
                onValueChange={(value) => setWarn({ ...warn, state: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in progress">In progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                defaultValue={warn?.description as string}
                onChange={(event) =>
                  setWarn({ ...warn, description: event.target.value })
                }
              />
            </div>
            <div className="space-x-2">
              <Button type="submit" value="createWarning">
                {navigation.state === 'submitting' ? 'submitting' : 'save'}
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
