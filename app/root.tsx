import { cssBundleHref } from '@remix-run/css-bundle';
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
  useLoaderData,
  useNavigation,
  useRevalidator,
} from '@remix-run/react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

import { createBrowserClient } from '@supabase/auth-helpers-remix';
import type { Database } from 'db_types';
import CreateServerSupabase from 'supabase.server';
import stylesheet from '~/globals.css';
import { themeSessionResolver } from './server.session';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';
import { Toaster } from './components/ui/toaster';

type TypedSupabaseClient = SupabaseClient<Database>;

export type SupabaseOutletContext = {
  supabase: TypedSupabaseClient;
};

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const env = {
    SUPERBASE_URL: process.env.SUPABASE_URL!,
    SUPERBASE_KEY: process.env.SUPABASE_KEY!,
  };

  const response = new Response();
  const supabase = CreateServerSupabase({ request, response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { getTheme } = await themeSessionResolver(request);

  return json(
    { env, session, them: getTheme() },
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
  const { env, session, them } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPERBASE_URL, env.SUPERBASE_KEY)
  );
  const revalidator = useRevalidator();
  const serverAccessToken = session?.access_token;
  const [theme] = useTheme();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== serverAccessToken) revalidator.revalidate();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, serverAccessToken, revalidator]);

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
        <Outlet context={{ supabase }} />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
