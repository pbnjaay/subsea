import { Form } from '@remix-run/react';
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

const LoginPage = () => {
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
