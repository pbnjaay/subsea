import Footer from './footer';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import Header from './header';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getSession } from '~/sessions';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.data.user) return redirect('/login');

  return json({ session }, { headers: response.headers });
};

const LandingLayout = () => {
  const navigation = useNavigation();
  const { session } = useLoaderData<typeof loader>();

  return (
    <>
      <Header />
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
