// File path: app/actions.ts
"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createClient as createClientClient } from "@/utils/supabase/client";
import { headers , cookies} from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { setCookie } from "cookies-next";


export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const regExp = new RegExp("^[a-z0-9._-]+@stonybrook\\.edu$", "i");

  if (!email || !regExp.test(email)) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Please use a valid @stonybrook.edu email address.",
    );
  }

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {const unique_id = crypto.randomUUID();
    // Insert a new user record into the 'users' table with initial defaults
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        username : unique_id,
        unique_id,
        email,
        onboarding_complete: false,
        // Add any other default fields here as needed
      });

    if (insertError) {
      console.error("Error inserting user record: ", insertError.message);
      return encodedRedirect("error", "/sign-up", insertError.message);
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};



export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const supabaseClient = await createClientClient();
  const origin = (await headers()).get("origin")!;

  // Sign in the user
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }
  console.log(email);

  // Fetch the user's profile (using .single() so we get an object)
  const { data: userProfile, error: profileError } = await supabaseClient
    .from("users")
    .select("unique_id")
    .eq("email", email)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError.message);
    return encodedRedirect("error", "/sign-in", profileError.message);
  }
  console.log("User profile", userProfile);

  if (userProfile?.unique_id) {
    // Instead of creating and returning a NextResponse instance,
    // call redirect() which performs the redirection server-side.
    redirect("/onboarding");
  }

  return encodedRedirect("error", "/sign-in", "User profile not found.");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  //clear cookies
  (await
    //clear cookies
    cookies()).delete("usernameID");

  return redirect("/sign-in");
};
