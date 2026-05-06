import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/landing(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/avatar(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/login", request.url).toString(),
    });
  }

  // Clear legacy guest cookie so old sessions don't linger
  const response = NextResponse.next();
  if (request.cookies.has("cashquest-guest")) {
    response.cookies.delete("cashquest-guest");
  }
  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
