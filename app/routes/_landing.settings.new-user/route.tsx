import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  Form,
  Links,
  Meta,
  Scripts,
  isRouteErrorResponse,
  useActionData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { Button } from '~/components/ui/button';

import prisma from 'client.server';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import {
  generateSalt,
  generateSimplePassword,
  hashPassword,
} from '~/services/utils';
import { commitSession, getSession } from '~/sessions';
import { mailer } from '~/entry.server';
import { render } from '@react-email/render';
import SubscriptionEmail from '~/components/subscription';
import { useEffect } from 'react';
import { useToast } from '~/components/ui/use-toast';
import { ToastDescription } from '~/components/ui/toast';
import Loader from '~/components/loader';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.data.user?.isAdmin)
    throw new Response('Unauthorized', { status: 401 });
  return json({}, { headers: { 'Set-Cookie': await commitSession(session) } });
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const response = new Response();
  const formData = await request.formData();
  const { email, fullName, username } = Object.fromEntries(formData);
  const isAdmin = formData.get('isAdmin') ?? 'false';
  const salt = generateSalt();
  const generatedPassword = generateSimplePassword(20);
  const hashedPassword = hashPassword(generatedPassword, salt);

  let user = await prisma.user.create({
    data: {
      email: String(email),
      password: hashedPassword,
      fullName: String(fullName),
      isAdmin: String(isAdmin) === 'false' ? false : true,
      salt: salt,
      username: String(username),
      profile: {
        create: {
          avatarUrl: `https://robohash.org/${username}.png`,
        },
      },
    },
  });

  if (user) {
    user.password = generatedPassword;

    const emailHtml = render(<SubscriptionEmail user={user} />);

    const transporter = mailer.createTransport({
      host: 'webmail.orange-sonatel.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        ciphers: 'TLSv1.2',
        rejectUnauthorized: false,
      },
    });
    const info = await transporter.sendMail({
      from: 'supervision.services@orange-sonatel.com',
      to: [user.email],
      subject: 'Informations de connexions',
      html: emailHtml,
    });

    return json({
      data: {
        success: { message: 'Inscription reussi !' },
        error: { message: null },
      },
    });
  }

  return json({
    data: {
      success: { message: null },
      error: { message: 'Il y eu un probleme, veuillez reesayez' },
    },
  });
};

const NewUserForm = () => {
  const navigation = useNavigation();
  const data = useActionData<typeof action>();
  const { toast } = useToast();

  useEffect(() => {
    if (data?.data.success.message) {
      toast({
        description: (
          <ToastDescription>{data.data.success.message}</ToastDescription>
        ),
      });
    }
    if (data?.data.error.message) {
      toast({
        variant: 'destructive',
        title: 'Oh, oh ! Quelque chose a mal tourné.',
        description: data.data.error.message,
      });
    }
  }, [data?.data]);

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
        <div className="flex items-center gap-x-4">
          <Label className="font-medium" htmlFor="isAdmin">
            Inscrire l'utilsateur en tant que administrateur
          </Label>
          <Input className="w-min" name="isAdmin" type="checkbox" />
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
