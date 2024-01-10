import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import prisma from 'client.server';
import { useEffect } from 'react';
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
import { Label } from '~/components/ui/label';
import { useToast } from '~/components/ui/use-toast';
import { hashPassword } from '~/services/utils';
import { commitSession, getSession } from '~/sessions';

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  let passWordMatch = false;
  const formData = await request.formData();
  const { password, username } = Object.fromEntries(formData);

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: String(username),
      },
    },
  });

  if (!user) {
    return json(
      { error: { message: 'Votre login ou mot de passe ne correspond pas' } },
      { headers: response.headers }
    );
  }

  const hashedPassword = hashPassword(String(password), user.salt);
  passWordMatch = hashedPassword === user.password;

  if (!passWordMatch) {
    return json(
      { error: { message: 'Votre login ou mot de passe ne correspond pas' } },
      { headers: response.headers }
    );
  }

  const session = await getSession(request.headers.get('Cookie'));

  session.set('user', user);
  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

const LoginPage = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { toast } = useToast();

  useEffect(() => {
    if (actionData?.error) {
      toast({
        variant: 'destructive',
        title: 'Oh, oh ! Quelque chose a mal tourné.',
        description: actionData.error.message,
      });
    }
  }, [actionData]);
  return (
    <div className="flex justify-center mt-8 mx-4 md:mx-0">
      <Card className="w-[20rem] md:w-[25rem]">
        <CardHeader>
          <CardTitle>Connectez-vous à votre compte</CardTitle>
          <CardDescription>
            Saisissez votre adresse électronique et votre mot de passe
            ci-dessous.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="username">
                Nom d'utilisateur
              </Label>
              <Input name="username" />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="password">
                Password
              </Label>
              <Input name="password" type="password" />
            </div>
            <Button className="w-full" type="submit">
              {navigation.state == 'loading' ? <Loader /> : 'Connectez-vous'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
