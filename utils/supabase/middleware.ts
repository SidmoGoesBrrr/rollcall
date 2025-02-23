// File path: utils/supabase/middleware.ts
// utils/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Start with a default response that carries over request headers
    let response = NextResponse.next({ request: { headers: request.headers } });
    const pathname = request.nextUrl.pathname;

    // Create a Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Retrieve the current auth user
    const { data: { user } } = await supabase.auth.getUser();

    // --- CASE 1: Not logged in (new user) ---
    if (!user) {
      // Allow only: "/", "/sign-in", and "/sign-up"
      if (
        pathname !== "/" &&
        pathname !== "/sign-in" &&
        pathname !== "/sign-up" &&
        pathname !== "/forgot-password"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return response;
    }

    // --- CASE 2 & 3: Logged in user ---
    // Retrieve the username/unique ID from cookies
    const usernameID = request.cookies.get("usernameID")?.value;
    

    // Query the database for the user's onboarding status
    const { data, error: dbError } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("unique_id", usernameID)
      .single();

    // Assume that if there's an error or no data, onboarding is incomplete
    const onboardingComplete = data?.onboarding_complete;

    // --- CASE 2: Logged in, but onboarding is NOT complete ---
    if (!onboardingComplete) {
      // Only allow access to "/onboarding"
      if (pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return response;
    }

    // --- CASE 3: Logged in and onboarding IS complete ---
    // If the user is trying to access the auth pages or onboarding, redirect them to "/"
    if (
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      pathname === "/onboarding"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, allow the request (including routes like "/" and "/profile/*")
    return response;
  } catch (e) {
    // In case of any errors (for example, missing env vars), let the request proceed.
    return NextResponse.next({ request: { headers: request.headers } });
  }
};
