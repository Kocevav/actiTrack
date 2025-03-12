"use server";

import { signIn } from "@/auth";

export const login = async () => {
  await signIn("strava", { redirectTo: "/" });
};

export const logOut = async () => {};
