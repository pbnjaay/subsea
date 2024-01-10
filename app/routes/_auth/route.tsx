import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

const AuthLayout = () => {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;
