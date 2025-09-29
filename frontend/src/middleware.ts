import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/jobs(.*)",
  "/api(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, isAuthenticated, redirectToSignIn } = await auth();

  // For users visiting the /onboarding page, no need to redirect
  if (isAuthenticated && isOnboardingRoute(req)) {
    return NextResponse.next();
  }

  // Non authenticated users trying to access protected routes are redirected to signin
  if (!isAuthenticated && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // If user is authenticated and hasnt completed onboarding, redirect them to /onboarding
  if (isAuthenticated && !sessionClaims.metadata.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // Finally, if the user is logged in and is looking to access a protected route, allow them
  if (isAuthenticated && !isPublicRoute(req)) {
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
