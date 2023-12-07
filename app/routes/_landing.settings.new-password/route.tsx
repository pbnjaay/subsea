import { ActionFunctionArgs, json } from '@remix-run/node';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import { Loader } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import { upDatePassword } from '~/services/api';

export const action = ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const error = upDatePassword({ request, response });
  if (!error) return json({ error: false }, { headers: response.headers });
  return json({ error: true }, { headers: response.headers });
};

const ChangePasswordForm = () => {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
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
        <Button type="submit">
          {navigation.state === 'submitting' ? <Loader /> : 'Changer'}
        </Button>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
