import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import {
  Form,
  json,
  redirect,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import Loader from '~/components/loader';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { getSession } from '~/sessions';
import prisma from 'client.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { fullName, username } = Object.fromEntries(formData);
  const session = await getSession(request.headers.get('Cookie'));

  const user = await prisma.user.update({
    where: {
      id: session.data.user?.id,
    },
    data: {
      username: String(username),
      fullName: String(fullName),
    },
  });

  if (!user) return;

  return json({});
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession(request.headers.get('Cookie'));
  if (!session) return redirect('/login');

  const profile = await prisma?.profile.findFirst({
    where: {
      userId: {
        equals: session.data.user?.id,
      },
    },
  });

  return json(
    { profile: profile, user: session.data.user },
    { headers: response.headers }
  );
};

const ProfileForm = () => {
  const navigation = useNavigation();
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          C'est ainsi que les autres vous verront sur le site.
        </p>
      </div>
      <Separator />
      <Form className="space-y-4" method="post" encType="multipart/form-data">
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="fullName">
            Nom complet
          </Label>
          <Input
            name="fullName"
            type="text"
            defaultValue={user?.fullName}
            required
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="username">
            Nom d'utilisateur
          </Label>
          <Input
            name="username"
            type="text"
            required
            defaultValue={user?.username}
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">
            {navigation.state === 'submitting' ? <Loader /> : 'Enregistrer'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileForm;
