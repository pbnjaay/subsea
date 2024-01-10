import Footer from './footer';
import { Outlet, useLoaderData, useNavigation } from '@remix-run/react';
import { loader } from './route';

export const LandingLayout = () => {
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
