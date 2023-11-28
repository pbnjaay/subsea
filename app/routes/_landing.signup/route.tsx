import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useNavigate } from '@remix-run/react';
import { Button } from '~/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { getCurrentUserProfile, getSession, signUp } from '~/services/api';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const session = await getSession({ request, response });
  if (!session) return redirect('/login');
  const profile = await getCurrentUserProfile(session.user.id, {
    request,
    response,
  });
  if (!profile.is_admin) return redirect('/401');

  return json({}, { headers: response.headers });
};
export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const error = await signUp({ request, response });
  if (!error) return redirect('/shift', { headers: response.headers });
  return json({}, { headers: response.headers });
};

const SignUp = () => {
  const navigate = useNavigate();
  return (
    <div className="container mt-8">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Ajouter un nouveau utilisateur</CardTitle>
          <CardDescription>
            Remplissez le formulaire suivant pour ajouter un utilisateur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="email">
                Email
              </Label>
              <Input name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="fullName">
                Nom complet
              </Label>
              <Input name="fullName" type="text" required />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="username">
                Nom d'utilisateur
              </Label>
              <Input name="username" type="text" required />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="password">
                Mot de passe
              </Label>
              <Input name="password" type="password" />
            </div>
            {/* <div className="flex gap-x-2 py-4">
              <Checkbox name="admin" />
              <Label className="font-medium" htmlFor="password">
                L'utilisateur est il un administrateur ?
              </Label>
            </div> */}
            <div className="flex space-x-4">
              <Button type="submit">Ajouter</Button>
              <Button
                variant={'secondary'}
                type="button"
                onClick={() => navigate(-1)}
              >
                Retour
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
