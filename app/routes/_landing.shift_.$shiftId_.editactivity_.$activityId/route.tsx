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
import Loader from '~/components/loader';
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
import { getActivity, updateActivity } from '~/services/api';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  invariant(params.activityId, 'Missing warningId param');

  const response = new Response();
  const data = await getActivity(parseInt(params.activityId), {
    response,
    request,
  });

  return json({ data }, { headers: response.headers });
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
  type: Database['public']['Enums']['type'] | null;
  state: Database['public']['Enums']['state'] | null;
}

const EditWarningPage = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { data } = useLoaderData<typeof loader>();
  const [activity, setActivity] = useState<Activity>({
    description: data.description,
    title: data.title,
    system: data.system,
    type: data.type,
    state: data.state,
  });

  return (
    <div className="container mt-8 ">
      <Card className="md:w-1/2 w-full">
        <CardHeader>
          <CardTitle>Modifier une activité</CardTitle>
          <CardDescription>
            Modifié l'activité rapidement en editant ce formulaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            {/* <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                type="text"
                required
                defaultValue={activity.title as string}
                onChange={(ev) =>
                  setActivity({ ...activity, title: ev.target.value })
                }
              />
            </div> */}
            <div className="flex space-x-4">
              <Select
                name="system"
                required
                defaultValue={activity.system}
                onValueChange={(value: Database['public']['Enums']['system']) =>
                  setActivity({ ...activity, system: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Système" />
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
                defaultValue={activity.type as string}
                onValueChange={(value: Database['public']['Enums']['type']) =>
                  setActivity({ ...activity, type: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plainte">Plainte</SelectItem>
                  <SelectItem value="call Id">Call ID</SelectItem>
                  <SelectItem value="signalisation">Signalisation</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="state"
                required
                defaultValue={activity.state as string}
                onValueChange={(value: Database['public']['Enums']['state']) =>
                  setActivity({ ...activity, state: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Etat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Ouvert</SelectItem>
                  <SelectItem value="in progress">En cours</SelectItem>
                  <SelectItem value="closed">Fermer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                name="description"
                defaultValue={activity.description as string}
                onChange={(ev) =>
                  setActivity({ ...activity, description: ev.target.value })
                }
              />
            </div>
            <div className="space-x-2">
              <Button
                disabled={navigation.state === 'submitting'}
                type="submit"
              >
                {navigation.state === 'submitting' ? <Loader /> : 'Modifier'}
              </Button>
              <Button
                type="button"
                variant={'secondary'}
                onClick={() => navigate(-1)}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWarningPage;
