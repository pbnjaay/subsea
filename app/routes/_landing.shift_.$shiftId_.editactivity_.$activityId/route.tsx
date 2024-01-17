import { $Enums, Activity } from '@prisma/client';
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
import Loader from '~/components/loader';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import prisma from 'client.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.shiftId, 'Missing shiftId param');
  invariant(params.activityId, 'Missing warningId param');

  const response = new Response();
  const data = await prisma?.activity.findFirst({
    where: {
      id: Number(params.activityId),
    },
  });

  if (!data)
    throw new Response('Not Found', { status: 404, statusText: 'NOT FOUND' });

  return json({ data }, { headers: response.headers });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.activityId, 'Missing warningId param');
  const formData = await request.formData();
  let { ...values } = Object.fromEntries(formData);

  const response = new Response();

  await prisma.activity.update({
    where: {
      id: Number(params.activityId),
    },
    data: { ...values },
  });

  return redirect(`/shift/${params.shiftId}`, { headers: response.headers });
};

const EditWarningPage = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { data } = useLoaderData<typeof loader>();

  const [activity, setActivity] = useState<Activity>({
    id: data.id,
    description: data.description,
    system: data.system,
    type: data.type,
    state: data.state,
    createdAt: new Date(data.createdAt),
    shiftId: data.shiftId,
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
            <div className="flex space-x-4">
              <Select
                name="system"
                required
                defaultValue={activity.system}
                onValueChange={(value: $Enums.System) =>
                  setActivity({ ...activity, system: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Système" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAT3">Sat3</SelectItem>
                  <SelectItem value="MAINONE">Mainone</SelectItem>
                  <SelectItem value="RAFIA">Rafia</SelectItem>
                  <SelectItem value="ACE">Ace</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="type"
                required
                defaultValue={activity.type as string}
                onValueChange={(value: $Enums.Type) =>
                  setActivity({ ...activity, type: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLAINTE">Plainte</SelectItem>
                  <SelectItem value="CALL_ID">Call ID</SelectItem>
                  <SelectItem value="SIGNALISATION">Signalisation</SelectItem>
                  <SelectItem value="INCIDENT">Incident</SelectItem>
                  <SelectItem value="AUTRE">Autre</SelectItem>
                </SelectContent>
              </Select>
              <Select
                name="state"
                required
                defaultValue={activity.state as string}
                onValueChange={(value: $Enums.State) =>
                  setActivity({ ...activity, state: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Etat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OUVERT">Ouvert</SelectItem>
                  <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                  <SelectItem value="CLOSED">Fermer</SelectItem>
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
