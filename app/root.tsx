import { cssBundleHref } from '@remix-run/css-bundle';
import { LoaderFunctionArgs, json, type LinksFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from '@remix-run/react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { createBrowserClient } from '@supabase/auth-helpers-remix';
import type { Database } from 'db_types';
import CreateServerSupabase from 'supabase.server';
import stylesheet from '~/globals.css';

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

  return json({ env, session }, { headers: response.headers });
};

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient<Database>(env.SUPERBASE_URL, env.SUPERBASE_KEY)
  );
  const revalidator = useRevalidator();
  const serverAccessToken = session?.access_token;

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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>Header</header>
        <Outlet context={{ supabase }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
