import { ActionFunctionArgs, json, redirect } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { Loader } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { destroySession, getSession } from '~/sessions';
import prisma from 'client.server';
import { generateSalt, hashPassword } from '~/services/utils';
import { useToast } from '~/components/ui/use-toast';
import { useEffect } from 'react';

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const formData = await request.formData();
  let passwordMatch = false;
  const { password, newPassword } = Object.fromEntries(formData);
  const user = await prisma.user.findFirst({
    where: { email: session.data.user?.email },
  });

  if (!user) {
    throw new Response('Unauthorized', { status: 401 });
  }

  passwordMatch = user.password === hashPassword(String(password), user.salt);

  if (!passwordMatch)
    return json({
      data: {
        error: { message: 'Votre ancien mot de passe ne correspond pas' },
      },
    });

  const salt = generateSalt();

  const newUser = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashPassword(String(newPassword), salt),
      salt: salt,
    },
  });

  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};

const ChangePasswordForm = () => {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  const { toast } = useToast();

  useEffect(() => {
    if (data?.data.error) {
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
        <h3 className="text-lg font-medium">Mot de passe</h3>
        <p className="text-sm text-muted-foreground">
          Veuillez saisir les informations suivantes pour modifier votre mot de
          passe. Le mot de passe doit comporter au moins 6 caractères et être
          différent de l'ancien mot de passe.
        </p>
      </div>
      <Separator />
      <Form className="space-y-4" method="post">
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="password">
            Ancien Mot de passe
          </Label>
          <Input name="password" type="password" />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label className="font-medium" htmlFor="newPassword">
            Nouveau mot de passe
          </Label>
          <Input name="newPassword" type="password" minLength={6} />
        </div>
        <Button type="submit">
          {navigation.state === 'submitting' ? <Loader /> : 'Changer'}
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
