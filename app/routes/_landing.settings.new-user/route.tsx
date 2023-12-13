import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import {
  Form,
  Links,
  Meta,
  Scripts,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { Loader } from 'lucide-react';
import { Button } from '~/components/ui/button';

import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { getCurrentUserProfile, getSession, signUp } from '~/services/api';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();

  const session = await getSession({ request, response });
  if (!session) return redirect('/login');
  const profile = await getCurrentUserProfile(session.user.id, {
    request,
    response,
  });
  if (!profile.is_admin) throw new Response('unauthorized', { status: 401 });
  return json({}, { headers: response.headers });
};
export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const error = await signUp({ request, response });
  if (!error) return redirect('/shift', { headers: response.headers });
  return json({}, { headers: response.headers });
};

const NewUserForm = () => {
  const navigation = useNavigation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Ajouter un nouveau utilisateur</h3>
        <p className="text-sm text-muted-foreground">
          Veuillez saisir les informations suivantes pour ajouter un
          utilisateur. Le mot de passe doit comporter au moins 6 caractères.
        </p>
      </div>
      <Separator />
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
        <div className="flex space-x-4">
          <Button type="submit">
            {navigation.state === 'submitting' ? <Loader /> : 'Ajouter'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewUserForm;

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="w-full h-screen flex flex-col space-y-4 justify-center items-center text-2xl font-semibold texpri">
            <p>
              {error.status} | {error.data}
            </p>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <h1>Uh oh ...</h1>
          <p>Something went wrong.</p>
          <pre>{errorMessage}</pre>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
