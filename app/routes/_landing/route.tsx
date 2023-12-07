import React from 'react';
import Footer from './footer';
import Header from './header';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { type LoaderFunctionArgs, redirect, json } from '@remix-run/node';
import { getCurrentUserProfile, getSession } from '~/services/api';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession({ request, response });
  if (!session) return redirect('/login');
  const profile = await getCurrentUserProfile(session.user.id, {
    request,
    response,
  });
  return json({ profile: profile }, { headers: response.headers });
};
const LandingLayout = () => {
  const navigation = useNavigation();
  const { profile } = useLoaderData<typeof loader>();
  return (
    <>
      <Header profile={profile} />
      <main
        className={
          navigation.state === 'loading'
            ? 'opacity-50 transition-opacity min-h-screen'
            : 'opacity-1 transition-opacity min-h-screen'
        }
      >
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default LandingLayout;
