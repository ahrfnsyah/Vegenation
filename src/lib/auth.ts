/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseCookies, setCookie, destroyCookie } from 'nookies';

export const loginUser = (token: string) => {
  setCookie(null, 'token', token, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
};

export const logoutUser = () => {
  destroyCookie(null, 'token');
};

export const getToken = (ctx?: any) => {
  const cookies = parseCookies(ctx);
  return cookies.token || null;
};
