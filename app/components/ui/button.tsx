import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { useOutletContext, Form } from '@remix-run/react';
import { SupabaseOutletContext } from '~/root';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
const LoginPage = () => {
  const { supabase } = useOutletContext<SupabaseOutletContext>();

  const handleLogin = () => {
    supabase.auth.signInWithPassword({
      email: 'pbnlgk@gmail.com',
      password: 'passer123',
    });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };

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
