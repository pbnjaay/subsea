import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
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
import { ToastDescription } from '~/components/ui/toast';
import { useToast } from '~/components/ui/use-toast';
import { upDatePassword } from '~/services/api';

export const action = ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const error = upDatePassword({ request, response });
  if (!error)
    return json(
      { PasswordSuccesfulyChanged: true },
      { headers: response.headers }
    );
  return json({ error: true }, { headers: response.headers });
};
const ProfilePage = () => {
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  if (actionData?.k) {
    toast({
      description: (
        <ToastDescription>
          Votre mot de passe a été modifié avec succès
        </ToastDescription>
      ),
    });
  }
  if (actionData?.error) {
    toast({
      variant: 'destructive',
      title: 'Oh, oh ! Quelque chose a mal tourné.',
      description: 'Votre mot de passe ne correspond pas',
    });
  }

  return (
    <div className="container mt-8 mx-4 md:mx-0">
      <Card className="w-[20rem] md:w-[25rem]">
        <CardHeader>
          <CardTitle>Modifie ton mot de passe</CardTitle>
          <CardDescription>
            Remplissez le formulaire suivant pour modifier votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form className="space-y-4" method="post">
            <div className="flex flex-col gap-y-2">
              <Label className="font-medium" htmlFor="email">
                Email
              </Label>
              <Input name="email" />
            </div>
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
              <Input name="newPassword" type="password" />
            </div>
            <Button className="w-full" type="submit">
              Changer
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
