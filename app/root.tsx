import {
  LoaderFunctionArgs,
  json,
  type LinksFunction,
  redirect,
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import clsx from 'clsx';

import stylesheet from '~/globals.css';
import { themeSessionResolver } from './server.session';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import { Toaster } from './components/ui/toaster';
import { destroySession, getSession } from './sessions';
import prisma from 'client.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

interface Profile {
  id: number;
  avatarUrl: string;
  updatedAt: Date;
  userId: number;
}

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  salt: string;
  fullName: string;
  isAdmin: boolean;
  createdAt: Date;
}

export type DatabaseOutletContext = {
  profile: Profile;
  user: User;
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  const session = await getSession(request.headers.get('Cookie'));

  if (_action === 'logout')
    return redirect('/login', {
      headers: {
        'Set-Cookie': await destroySession(session),
      },
    });

  return json({});
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = new Response();
  const session = await getSession(request.headers.get('Cookie'));
  if (!session) return redirect('/login');

  const profile = await prisma.profile.findFirst({
    where: {
      userId: {
        equals: session.data.user?.id,
      },
    },
  });

  const { getTheme } = await themeSessionResolver(request);
  return json(
    { profile: profile, user: session.data.user, them: getTheme() },
    { headers: response.headers }
  );
};

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.them} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

export function App() {
  const { them, profile, user } = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const context = {
    profile,
    user,
  };
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(them)} />
        <Links />
      </head>
      <body>
        <Outlet context={context} />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="w-full h-screen flex flex-col space-y-4 justify-center items-center text-2xl font-semibold texpri">
            <p>
              {error.status} | {error.data}
            </p>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          <h1>Uh oh ...</h1>
          <p>Something went wrong.</p>
          <pre>{errorMessage}</pre>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
