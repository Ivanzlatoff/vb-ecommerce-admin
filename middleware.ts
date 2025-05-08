import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { i18nRouter } from "next-i18n-router";

import i18nConfig from "./i18nConfig";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes
} from "@/routes";


const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  console.log({nextUrl})
  const isLoggedIn = !!req.auth;
  console.log({isLoggedIn})
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  console.log({isApiAuthRoute})
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  console.log({isPublicRoute})
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  console.log({isAuthRoute})
  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    console.log({encodedCallbackUrl})
    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ));
  }

  return null;
});

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}


