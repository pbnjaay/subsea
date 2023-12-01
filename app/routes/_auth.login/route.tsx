import { ActionFunctionArgs, redirect, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { useEffect } from 'react';
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
import { login } from '~/services/api';

export const action = async ({ request }: ActionFunctionArgs) => {
  const response = new Response();
  const error = await login({ request, response });
  if (!error) return redirect('/', { headers: response.headers });
  return json({ error: true }, { headers: response.headers });
};

const LoginPage = () => {
  const actionData = useActionData<typeof action>();
  const { toast } = useToast();

  useEffect(() => {
    if (actionData?.error) {
      toast({
        variant: 'destructive',
        title: 'Oh, oh ! Quelque chose a mal tourné.',
        description: 'Votre login ou mot de passe ne correspond pas',
      });
    }
  }, [actionData]);
  return (
    <div className="flex justify-center mt-8 mx-4 md:mx-0">
      <Card className="w-[20rem] md:w-[25rem]">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Enter your email and password below.
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
                Password
              </Label>
              <Input name="password" type="password" />
            </div>
            <Button className="w-full" type="submit">
              Login
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
