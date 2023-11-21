import React from 'react';
import Footer from './footer';
import Header from './header';
import { Outlet } from '@remix-run/react';
import { type LoaderFunctionArgs, redirect, json } from '@remix-run/node';
import { getSession } from '~/services/api';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession({ request, response });
  if (!session) return redirect('/login');
  return json({ ok: true }, { headers: response.headers });
};
const LandingLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default LandingLayout;
