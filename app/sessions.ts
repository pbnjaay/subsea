// app/sessions.ts
import { createCookieSessionStorage } from '@remix-run/node'; // or cloudflare/deno

type SessionData = {
  user: {
    id: number;
    email: string;
    username: string;
    fullName: string;
    isAdmin: boolean;
    createdAt: Date;
  };
};

type SessionFlashData = {
  error: string;
};
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create 0-one
    cookie: {
      name: '_session', // use any name you want here
      sameSite: 'lax', // this helps with CSRF
      path: '/', // remember to add this so the cookie will work in all routes
      httpOnly: true, // for security reasons, make this cookie http only
      secrets: [process.env.SESSION_KEY!], // replace this with an actual secret
      secure: process.env.NODE_ENV === 'production', // enable this in prod only
    },
  });

export { getSession, commitSession, destroySession };
